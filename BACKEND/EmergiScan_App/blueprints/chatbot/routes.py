from __future__ import annotations

from datetime import datetime
from flask import request, jsonify
from sqlalchemy import select

from . import chatbot_bp
from EmergiScan_App.models import (
    db,
    Patients,
    PatientsQRToken,
    ChatSession,
    ChatMessage,
    Allergy,
    Conditions,
    Medications,
)

from EmergiScan_App.ai.llm_service import generate_reply


WELCOME_MESSAGE = (
    "Hello! I'm the EmergiScan AI assistant. "
    "I can help you with this patient's medical information. "
    "First, please type your first name?"
)


# -----------------------------
# Helpers
# -----------------------------

def build_patient_display_panel(patient: Patients) -> dict:
    """
    SMALL set for LEFT PANEL UI only.
    Returned from /chatbot/session.
    """
    return {
        "first_name": patient.first_name,
        "last_name": patient.last_name,
        "gender": patient.gender,
        "date_of_birth": patient.date_of_birth.isoformat() if patient.date_of_birth else None,
        "blood_type": patient.blood_type,
        "preferred_hospital": patient.preferred_hospital,
        "emergency_contact_name": patient.emergency_contact_name,
        "emergency_contact_relationship": patient.emergency_contact_relationship,
        "emergency_contact_phone": patient.emergency_contact_phone,
    }


def build_patient_snapshot(patient: Patients) -> dict:
    """
    FULL snapshot for AI grounding (stored in chat_sessions.patient_snapshot_json).
    Includes:
      - all Patients fields (excluding password)
      - Allergy / Conditions / Medications
    """

    # 1) Patient fields (exclude password!)
    patient_full = {
        "id": patient.id,
        "first_name": patient.first_name,
        "middle_name": patient.middle_name,
        "last_name": patient.last_name,
        "email": patient.email,
        "phone": patient.phone,
        "date_of_birth": patient.date_of_birth.isoformat() if patient.date_of_birth else None,
        "gender": patient.gender,
        "blood_type": patient.blood_type,
        "address": patient.address,
        "preferred_hospital": patient.preferred_hospital,
        "emergency_contact_name": patient.emergency_contact_name,
        "emergency_contact_relationship": patient.emergency_contact_relationship,
        "emergency_contact_phone": patient.emergency_contact_phone,
    }

    # 2) Allergies
    allergies = db.session.execute(
        select(Allergy).where(Allergy.patient_id == patient.id)
    ).scalars().all()

    allergies_list = [
        {
            "allergen": a.allergen,
            "allergy_type": a.allergy_type,
            "reaction": a.reaction,
            "severity": a.severity,
        }
        for a in allergies
    ]

    # 3) Conditions
    conditions = db.session.execute(
        select(Conditions).where(Conditions.patient_id == patient.id)
    ).scalars().all()

    conditions_list = [
        {
            "condition_name": c.condition_name,
            "is_chronic": c.is_chronic,
            "notes": c.notes,
        }
        for c in conditions
    ]

    # 4) Medications
    meds = db.session.execute(
        select(Medications).where(Medications.patient_id == patient.id)
    ).scalars().all()

    meds_list = [
        {
            "medication_name": m.medication_name,
            "medication_purpose": m.medication_purpose,
            "dosage": m.dosage,
            "frequency": m.frequency,
            "route": m.route,
            "is_active": m.is_active,
            "notes": m.notes,
        }
        for m in meds
    ]

    return {
        "patient": patient_full,
        "allergies": allergies_list,
        "conditions": conditions_list,
        "medications": meds_list,
    }


def load_chat_history(session_id: int) -> list[dict]:
    """
    Load ordered chat history from DB for the AI model.
    Returns list of: {"role": "...", "content": "..."}
    """
    messages = db.session.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_id)
        .order_by(ChatMessage.created_at)
    ).scalars().all()

    return [{"role": m.role, "content": m.content} for m in messages]


# -----------------------------
# Routes
# -----------------------------

@chatbot_bp.route("/session", methods=["POST"])
def start_chat_session():
    """
    Request JSON: { "token": "<qr.token>" }

    Creates:
      - chat_sessions row (stores patient_snapshot_json)
      - chat_messages row (welcome message)

    Returns:
      { session_id, assistant_message, patient_panel (small UI panel) }
    """
    data = request.get_json(silent=True) or {}
    token = (data.get("token") or "").strip()

    if not token:
        return jsonify({"error": "Missing token"}), 400

    # 1) Lookup QR token -> patient_id (Good Stub: real lookup)
    qr = db.session.execute(
        select(PatientsQRToken).where(PatientsQRToken.token == token)
    ).scalars().first()

    if not qr:
        return jsonify({"error": "Invalid QR token"}), 404

    # 2) Load patient
    patient = db.session.get(Patients, qr.patient_id)
    if not patient:
        return jsonify({"error": "Patient not found"}), 404

    # 3) Build UI panel + AI snapshot
    patient_display_panel = build_patient_display_panel(patient)
    patient_snapshot = build_patient_snapshot(patient)

    # 4) Create chat session (store snapshot)
    session = ChatSession(
        patient_id=patient.id,
        responder_name=None,
        qr_token_id=qr.id,
        patient_snapshot_json=patient_snapshot
    )
    db.session.add(session)
    db.session.flush()  # get session.id before creating welcome message

    # 5) Store welcome message in chat history
    welcome_msg = ChatMessage(
        session_id=session.id,
        role="assistant",
        content=WELCOME_MESSAGE
    )
    db.session.add(welcome_msg)
    db.session.commit()

    return jsonify({
        "session_id": session.id,
        "assistant_message": WELCOME_MESSAGE,
        "patient_panel": patient_display_panel
    }), 201


@chatbot_bp.route("/message", methods=["POST"])
def post_message():
    """
    Request JSON: { "session_id": <int>, "message": "<text>" }

    Behavior:
      - If responder_name is empty, treat first message as responder_name.
      - Otherwise, generate AI reply using patient_snapshot_json + chat history.
      - Store BOTH user and assistant messages in DB.
      - If session ended, block further messages (409).
    """
    data = request.get_json(silent=True) or {}
    session_id = data.get("session_id")
    message = (data.get("message") or "").strip()

    if not session_id:
        return jsonify({"error": "Missing session_id"}), 400
    if not message:
        return jsonify({"error": "Missing message"}), 400

    session = db.session.get(ChatSession, session_id)
    if not session:
        return jsonify({"error": "Session not found"}), 404

    # Enforce: AI must stop responding after end
    if session.ended_at is not None:
        return jsonify({"error": "Chat session is completed. No further messages allowed."}), 409

    # Save user message
    db.session.add(ChatMessage(session_id=session.id, role="user", content=message))
    db.session.flush()

    # If responder_name not set yet, treat first user message as responder name
    if not session.responder_name:
        session.responder_name = message

        assistant_text = (
            f"Thanks, {session.responder_name}. "
            "How can I help you with this patient's medical information?"
        )
        db.session.add(ChatMessage(session_id=session.id, role="assistant", content=assistant_text))
        db.session.commit()

        return jsonify({
            "session_id": session.id,
            "assistant_message": assistant_text
        }), 200

    # Use snapshot for AI (Option B)
    patient_snapshot = session.patient_snapshot_json or {}

    # Build chat_history for the AI
    chat_history = load_chat_history(session.id)

    # Generate AI reply
    assistant_text = generate_reply(
        patient_snapshot=patient_snapshot,
        chat_history=chat_history,
        user_message=message
    )

    # Save assistant message
    db.session.add(ChatMessage(session_id=session.id, role="assistant", content=assistant_text))
    db.session.commit()

    return jsonify({
        "session_id": session.id,
        "assistant_message": assistant_text
    }), 200

from datetime import datetime
from flask import jsonify
from EmergiScan_App.models import db, ChatSession


@chatbot_bp.route("/session/<int:session_id>/end", methods=["POST"])
def end_chat_session(session_id):
    """
    Ends a chatbot session.
    After this, AI should stop responding for this session.
    """

    session = db.session.get(ChatSession, session_id)

    if not session:
        return jsonify({"error": "Chat session not found"}), 404

    if session.ended_at is not None:
        return jsonify({"message": "Chat session already ended"}), 200

    session.ended_at = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "Chat session ended"}), 200
from EmergiScan_App.utils.qr import get_or_create_qr_token #added
from . import patients_bp
from marshmallow import ValidationError
from flask import request, jsonify
from sqlalchemy import select
from EmergiScan_App.models import Patients, db, ChatSession, ChatMessage
from EmergiScan_App.blueprints.patients.schema import patients_schema, patientschema, loginschema, signupschema
from EmergiScan_App.utils.util import encode_token, ph, required_token
from argon2.exceptions import VerifyMismatchError

# Login route for patients
@patients_bp.route("/login", methods=["POST"])
def login_patient():
    try:
        credentials = loginschema.load(request.json)
        email = credentials["email"]
        password = credentials["password"]
    except ValidationError as e:
        return jsonify(e.messages), 400

    # Makes a query to check if the user is in database
    query = select(Patients).where(Patients.email == email)
    patient = db.session.execute(query).scalars().first()

    if not patient:
        return jsonify({"error": "Invalid email or password"}), 401
    
    #This is used to verify the hash password that was created in signup
    try:
        ph.verify(patient.password, password)
    except VerifyMismatchError:
        return jsonify({"error": "Invalid email or password"}), 401
    
    token = encode_token(patient.id)
    #added - generate or get qr token
    qr = get_or_create_qr_token(patient.id) 
    FRONTEND_BASE_URL = "http://localhost:5173/chatbot"
    qr_url = f"{FRONTEND_BASE_URL}/{qr.token}"

    return jsonify({
        "response": "Success",
        "message": "Logged in succefully",
        "User": {
            "id": patient.id,
            "first_name": patient.first_name,
            "last_name": patient.last_name,
            "email": patient.email
        },
        "token": token,
        "qr_url": qr_url #added
    }), 200
    
#Signup routes for patient
@patients_bp.route("/signup", methods=["POST"])
def signup():
    try:
        patient_info = signupschema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400

    # Hash the password, enabling security
    patient_info["password"] = ph.hash(patient_info["password"])

    query = select(Patients).where(Patients.email == patient_info["email"])
    existing_patient = db.session.execute(query).scalars().all()

    # checks if the patient already exist in the database before creating new account
    if existing_patient:
        return jsonify({"error": "Email already registered"}), 400
    new_patient = Patients(
        first_name = patient_info["first_name"],
        #middle_name= patient_info["middle_name"],
        last_name= patient_info["last_name"],
        email = patient_info["email"],
        password = patient_info["password"]
    )
    db.session.add(new_patient)
    db.session.commit()
    return signupschema.jsonify({
        "id": new_patient.id,
        "first_name": new_patient.first_name,
        #"middle_name": new_patient.middle_name,
        "last_name": new_patient.last_name,
        "email": new_patient.email
    }), 201


# Creates patient personal information
@patients_bp.route("/me", methods=["PUT"])
@required_token
def update_patient_info(patient_id):
    patient = db.session.get(Patients, patient_id)  # gets the specific patient
    if not patient:
        return jsonify({"error": "Sorry, patient does not exist"}), 404
    
    data = request.get_json()
    for key, value in data.items():
        if value == "":
            data[key] = None
    
    try:
        patient_data = patientschema.load(request.json, partial=True)
    except ValidationError as e:
        return jsonify(e.messages), 400

    for key, value in patient_data.items():
        if value is not None:  # allows some fields to be blank
            setattr(patient, key, value)

    db.session.commit()
    return patientschema.jsonify(patient)


# Retrieve all users
@patients_bp.route("/", methods=["GET"])
def get_users():
    query = select(Patients)
    patients = db.session.execute(query).scalars().all()
    return patients_schema.jsonify(patients)

#Retrieve a single user
@patients_bp.route("/me", methods=['GET'])
@required_token
def get_user(patient_id):
    patient = db.session.get(Patients, patient_id)
    if not patient:
        return jsonify({"error": "Sorry, user not found"}), 404
    return patientschema.jsonify(patient), 200

#Deletes a user
@patients_bp.route("/me", methods=['DELETE'])
@required_token
def delete_user(patient_id):
    patient = db.session.get(Patients, patient_id)
    if not patient:
        return jsonify({"error": "Sorry, user not found"}), 404
    
    db.session.delete(patient)
    db.session.commit()
    return jsonify({"message": f"User: {patient_id} deleted successfully"}), 200

@patients_bp.route("/me/chats", methods=["GET"])
@required_token
def list_patient_chats(patient_id):
    """
    List completed chat sessions for the logged-in patient.
    """

    query = (
        select(ChatSession)
        .where(ChatSession.patient_id == patient_id)
        .where(ChatSession.ended_at.isnot(None))
        .order_by(ChatSession.created_at.desc())
    )

    sessions = db.session.execute(query).scalars().all()

    chats = [
        {
            "session_id": s.id,
            "responder_name": s.responder_name,
            "created_at": s.created_at.isoformat() if s.created_at else None,
            "ended_at": s.ended_at.isoformat() if s.ended_at else None,
        }
        for s in sessions
    ]

    return jsonify({"chats": chats}), 200

@patients_bp.route("/me/chats/<int:session_id>", methods=["GET"])
@required_token
def get_patient_chat_detail(patient_id, session_id):
    """
    Get one completed chat session + its messages for the logged-in patient.
    """

    session = db.session.get(ChatSession, session_id)
    if not session:
        return jsonify({"error": "Chat session not found"}), 404

    # Authorization: patient can only access their own session
    if session.patient_id != int(patient_id):
        return jsonify({"error": "Forbidden"}), 403

    # Only completed chats are visible to patient
    if session.ended_at is None:
        return jsonify({"error": "Chat session not completed"}), 403

    # Load messages ordered by time
    msgs = db.session.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session.id)
        .order_by(ChatMessage.created_at.asc())
    ).scalars().all()

    messages = [
        {
            "role": m.role,
            "content": m.content,
            "created_at": m.created_at.isoformat() if m.created_at else None,
        }
        for m in msgs
    ]

    payload = {
        "session": {
            "session_id": session.id,
            "responder_name": session.responder_name,
            "created_at": session.created_at.isoformat() if session.created_at else None,
            "ended_at": session.ended_at.isoformat() if session.ended_at else None,
        },
        "messages": messages,
    }

    return jsonify(payload), 200
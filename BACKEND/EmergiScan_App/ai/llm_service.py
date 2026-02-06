"""
LLM Service for EmergiScan Chatbot
Provides generate_reply() function for handling patient-aware Q&A
"""

from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
from typing import Dict, List

# Global model and pipeline (cached at startup)
_model = None
_tokenizer = None
_pipe = None

MODEL_NAME = "microsoft/Phi-3.5-mini-instruct"

def _initialize_model():
    """Load model and tokenizer once at startup"""
    global _model, _tokenizer, _pipe
    
    if _pipe is not None:
        return  # Already initialized
    
    try:
        print(f"Loading model: {MODEL_NAME}...")
        _tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        _model = AutoModelForCausalLM.from_pretrained(
            MODEL_NAME,
            device_map="auto",
            torch_dtype="auto"
        )

        _pipe = pipeline(
            "text-generation",
            model=_model,
            tokenizer=_tokenizer,
            max_new_tokens=80,
            do_sample=True,
            temperature=0.3,
            top_p=0.9
        )
        print("Model loaded successfully!\n")
    except Exception as e:
        print(f"Error loading model: {e}")
        raise

def _format_chat_history(chat_history: List[Dict]) -> str:
    """
    Convert chat_history (list of {"role": "...", "content": "..."})
    into a compact plain-text block for the LLM prompt.
    Returns empty string if no history.
    """
    if not chat_history:
        return ""

    # Keep history short for speed (last 6 messages only)
    # This helps reduce prompt length and improve latency.
    recent_history = (chat_history or [])[-6:]


    lines = ["=== CHAT HISTORY ==="]
    for i, msg in enumerate(recent_history, 1):
        role = (msg.get("role") or "unknown").upper()
        content = msg.get("content") or ""
        # collapse newlines to spaces for compactness
        content_single = " ".join(content.splitlines()).strip()
        lines.append(f"{i}. {role}: {content_single}")
    lines.append("")  # trailing blank line
    return "\n".join(lines)

def _format_patient_context(patient_snapshot: Dict) -> str:
    """
    Format patient snapshot dict into plain text for the prompt
    
    Args:
        patient_snapshot: Dict containing patient, allergies, conditions, medications
    
    Returns:
        Formatted plain text context
    """
    context = "=== PATIENT DATA ===\n"
    
    # Patient demographics
    patient = patient_snapshot.get("patient", {})
    context += f"Name: {patient.get('first_name', 'N/A')} {patient.get('last_name', 'N/A')}\n"
    context += f"DOB: {patient.get('date_of_birth', 'N/A')}\n"
    context += f"Gender: {patient.get('gender', 'N/A')}\n"
    context += f"Blood Type: {patient.get('blood_type', 'N/A')}\n"
    context += f"Phone: {patient.get('phone', 'N/A')}\n"
    context += f"Email: {patient.get('email', 'N/A')}\n"
    context += f"Address: {patient.get('address', 'N/A')}\n"
    context += f"Preferred Hospital: {patient.get('preferred_hospital', 'N/A')}\n"
    context += f"Emergency Contact: {patient.get('emergency_contact_name', 'N/A')} ({patient.get('emergency_contact_relationship', 'N/A')})\n"
    context += f"Emergency Phone: {patient.get('emergency_contact_phone', 'N/A')}\n\n"
    
    # Allergies
    context += "=== ALLERGIES ===\n"
    allergies = patient_snapshot.get("allergies", [])
    if allergies:
        for allergy in allergies:
            context += f"- Allergen: {allergy.get('allergen', 'N/A')}\n"
            context += f"  Type: {allergy.get('allergy_type', 'N/A')}\n"
            context += f"  Reaction: {allergy.get('reaction', 'N/A')}\n"
            context += f"  Severity: {allergy.get('severity', 'N/A')}\n\n"
    else:
        context += "No known allergies recorded.\n\n"
    
    # Conditions
    context += "=== CONDITIONS ===\n"
    conditions = patient_snapshot.get("conditions", [])
    if conditions:
        for condition in conditions:
            context += f"- Condition: {condition.get('condition_name', 'N/A')}\n"
            context += f"  Chronic: {condition.get('is_chronic', 'N/A')}\n"
            context += f"  Notes: {condition.get('notes', 'N/A')}\n\n"
    else:
        context += "No conditions recorded.\n\n"
    
    # Medications
    context += "=== ACTIVE MEDICATIONS ===\n"
    medications = patient_snapshot.get("medications", [])
    if medications:
        for med in medications:
            context += f"- Medication: {med.get('medication_name', 'N/A')}\n"
            context += f"  Purpose: {med.get('medication_purpose', 'N/A')}\n"
            context += f"  Dosage: {med.get('dosage', 'N/A')}\n"
            context += f"  Frequency: {med.get('frequency', 'N/A')}\n"
            context += f"  Route: {med.get('route', 'N/A')}\n"
            context += f"  Notes: {med.get('notes', 'N/A')}\n\n"
    else:
        context += "No active medications recorded.\n\n"
    
    return context


def generate_reply(patient_snapshot: Dict, chat_history: List[Dict], user_message: str) -> str:
    """
    Generate AI reply based on patient data and user question
    
    Args:
        patient_snapshot: Dict with patient, allergies, conditions, medications
        user_message: User's question/message
    
    Returns:
        AI-generated response string
    """
    try:
        # Initialize model if not already done
        _initialize_model()
        
        # Format patient context
        patient_context = _format_patient_context(patient_snapshot)

        history_text=_format_chat_history(chat_history)
        
        # System prompt
        system_prompt = """You are a medical information assistant for emergency responders. 
Provide clear, concise, and accurate information based only on the patient data provided.
If information is not available in the patient snapshot, clearly state "This information is not recorded".
Be helpful and professional."""
        
        # Build full prompt
        prompt = f"""{system_prompt}

{patient_context}

Responder Request: {user_message}

Response:"""
        
        # Generate response
        result = _pipe(prompt, return_full_text=False)

        # Extract only the response part before the next Responder Request
        response = result[0]["generated_text"].split("Responder Request")[0].strip()
        return response
    
    except Exception as e:
        return f"Error generating response: {str(e)}"
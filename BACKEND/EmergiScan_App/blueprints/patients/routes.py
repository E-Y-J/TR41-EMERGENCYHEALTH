from EmergiScan_App.utils.qr import get_or_create_qr_token #added
from . import patients_bp
from marshmallow import ValidationError
from flask import request, jsonify
from sqlalchemy import select
from EmergiScan_App.models import Patients, PatientsQRToken, db
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
        "is_revoked": qr.is_revoked, #added
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

#added
#route to revoke patient QR token 
@patients_bp.route("/me/revoke_qr", methods=["POST"])
@required_token
def revoke_qr_token(patient_id):
    query = select(PatientsQRToken).where(PatientsQRToken.patient_id == patient_id, PatientsQRToken.is_revoked == False)
    existing_token = db.session.execute(query).scalars().first()

    if not existing_token:
        return jsonify({"error": "No active QR token found"}), 404

    existing_token.is_revoked = True
    db.session.commit()

    return jsonify({"message": "QR token revoked successfully"}), 200

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
            if key == "password":
                patient.password = ph.hash(value)  
            else:
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

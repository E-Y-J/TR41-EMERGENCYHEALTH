from . import patients_bp
from marshmallow import ValidationError
from flask import request, jsonify
from sqlalchemy import select
from EmergiScan_App.models import Patients, db
from EmergiScan_App.blueprints.patients.schema import (
    patients_schema,
    patientschema,
    loginschema,
    signupschema,
)
from EmergiScan_App.utils.util import encode_token, decode_token, ph
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
        return jsonify({"Message": "Invalid email or password"}), 401

    # This is used to verify the hash password that was created in signup
    try:
        ph.verify(patient.password, password)
    except VerifyMismatchError:
        return jsonify({"Message": "Invalid email or password"}), 401

    token = encode_token(patient.id)

    return (
        jsonify(
            {
                "response": "Success",
                "Message": "Logged in succefully",
                "User": {
                    "id": patient.id,
                    "first_name": patient.first_name,
                    "last_name": patient.last_name,
                    "email": patient.email,
                },
                "token": token,
            }
        ),
        200,
    )


# Signup routes for patient
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
        return jsonify({"Error": "Patient already exist"}), 400
    new_patient = Patients(**patient_info)
    db.session.add(new_patient)
    db.session.commit()
    return signupschema.jsonify(new_patient), 201


# Creates patient personal information
@patients_bp.route("/<int:patient_id>", methods=["PUT"])
def update_patient_info(patient_id):
    patient = db.session.get(Patients, patient_id)  # gets the specific patient
    if not patient:
        return jsonify({"Message": "Sorry, patient does not exist"}), 404
    try:
        patient_data = patientschema.load(request.json, partial=True)
    except ValidationError as e:
        return jsonify(e.messages), 400

    for key, value in patient_data.items():
        if value not in ("", None):  # allows some fields to be blank
            setattr(patient, key, value)

    db.session.commit()
    return patientschema.jsonify(patient)


# Get current logged in user information
@patients_bp.route("/me", methods=["GET", "POST"])
def get_current_patient():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"Message": "No token provided"}), 401

    try:
        token = auth_header.split(" ")[1]  # Bearer <token>
    except IndexError:
        return jsonify({"Message": "Invalid token format"}), 401

    patient_id = decode_token(token)
    if not patient_id:
        return jsonify({"Message": "Invalid or expired token"}), 401

    patient = db.session.get(Patients, int(patient_id))
    if not patient:
        return jsonify({"Message": "Patient not found"}), 404

    return patientschema.jsonify(patient), 200


# Retrieve all users
@patients_bp.route("/", methods=["GET"])
def get_users():
    query = select(Patients)
    patients = db.session.execute(query).scalars().all()
    return patients_schema.jsonify(patients)

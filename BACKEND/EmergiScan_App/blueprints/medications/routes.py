from . import medications_bp
from marshmallow import ValidationError
from flask import request, jsonify
from sqlalchemy import select
from EmergiScan_App.models import Medications, Patients, db
from EmergiScan_App.utils.util import required_token
from EmergiScan_App.blueprints.medications.schema import medication_schema, medications_schema

#Create a Medication
@medications_bp.route("/", methods=['POST'])
@required_token
def create_medication(patient_id):
    patient = db.session.get(Patients, patient_id)
    if not patient:
        return jsonify({"error": "Sorry, patient does not exist"}), 404
    try:
        data = medication_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400
    
    medication = Medications(**data, patient_id = patient.id)
    db.session.add(medication)
    db.session.commit()
    return medication_schema.jsonify(medication), 201

#Retrieves a Medication
@medications_bp.route("/",methods=['GET'])
@required_token
def get_medications(patient_id):
    patient = db.session.get(Patients, patient_id)
    if not patient:
        return jsonify({"error": "Sorry, patient does not exist"}), 404
    
    query = select(Medications).where(Medications.patient_id == patient.id)
    medications= db.session.execute(query).scalars().all()
    return medications_schema.jsonify(medications), 200

#Update a Medication
@medications_bp.route("/<int:medication_id>", methods=['PUT'])
@required_token
def update_medication(patient_id, medication_id):
    patient = db.session.get(Patients, patient_id)
    if not patient:
        return jsonify({"error": "Sorry, patient does not exist"}), 404
    
    medication = db.session.get(Medications, medication_id)
    if not medication or medication.patient_id != patient.id:
        return jsonify({"error": "Medication not found or unauthorized!"}), 404
    
    try:
        data = medication_schema.load(request.json, partial=True)
    except ValidationError as e:
        return jsonify(e.messages), 400
    
    for key, value in data.items():
        if value not in ("", None): 
            setattr (medication, key, value)
    
    db.session.commit()
    return medication_schema.jsonify(medication)

#Delete a medication for a patient
@medications_bp.route("/<int:medication_id>",methods=['DELETE'])
@required_token
def delete_condition(patient_id, medication_id):
    patient = db.session.get(Patients, patient_id)
    if not patient:
        return jsonify({"error": "Sorry, patient does not exist"}), 404
    
    medication = db.session.get(Medications, medication_id)
    if not medication or medication.patient_id != patient.id:
        return jsonify({"error": "Medication not found or unauthorized to delete!"}), 404
    
    medication_name = medication.medicine_name #gets the name of the medication that you want to delete

    db.session.delete(medication)
    db.session.commit()
    return jsonify({"message": f"Medication: {medication_name} deleted successfully!"})


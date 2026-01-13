from . import allergies_bp
from marshmallow import ValidationError
from flask import request, jsonify
from sqlalchemy import select
from EmergiScan_App.models import Allergy, Patients, db
from EmergiScan_App.utils.util import required_token
from EmergiScan_App.blueprints.allergies.schema import allergies_schema, allergyschema

#Creates an allergy record
@allergies_bp.route("/", methods=['POST'])
@required_token
def create_allergy(patient_id):
    patient = db.session.get(Patients, patient_id)
    if not patient:
        return jsonify({"error": "Sorry, patient does not exist"}), 404
    try:
        allergy_info = allergyschema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400
    
    allergy_created = Allergy(**allergy_info, patient_id = patient.id)
    db.session.add(allergy_created)
    db.session.commit()
    return allergyschema.jsonify(allergy_created), 201
    
#Get allergy record for a patient
@allergies_bp.route("/",methods=['GET'])
@required_token
def get_allergy(patient_id):
    patient = db.session.get(Patients, patient_id)
    if not patient:
        return jsonify({"error": "Sorry, patient does not exist"}), 404
    
    query = select(Allergy).where(Allergy.patient_id == patient.id)
    known_allergies = db.session.execute(query).scalars().all()
    return allergies_schema.jsonify(known_allergies), 200

#Update allergy record
@allergies_bp.route("/<int:allergy_id>", methods=['PUT'])
@required_token
def update_allergy(patient_id, allergy_id):
    patient = db.session.get(Patients, patient_id)
    if not patient:
        return jsonify({"error": "Sorry, patient does not exist"}), 404
    
    allergy = db.session.get(Allergy, allergy_id)
    if not allergy or allergy.patient_id != patient.id:
        return jsonify({"error": "Allergy not found or unauthorized!"}), 404
    
    try:
        data = allergyschema.load(request.json, partial=True)
    except ValidationError as e:
        return jsonify(e.messages), 400
    
    for key, value in data.items():
        if value not in ("", None): 
            setattr (allergy, key, value)
    
    db.session.commit()
    return allergyschema.jsonify(allergy)


#Delete allergy record for a patient
@allergies_bp.route("/<int:allergy_id>",methods=['DELETE'])
@required_token
def delete_allergy(patient_id, allergy_id):
    patient = db.session.get(Patients, patient_id)
    if not patient:
        return jsonify({"error": "Sorry, patient does not exist"}), 404
    
    allergy = db.session.get(Allergy, allergy_id)
    if not allergy or allergy.patient_id != patient.id:
        return jsonify({"error": "Allergy not found or unauthorized to delete!"}), 404
    
    allergy_name = allergy.allergen #gets the name of the medication that you want to delete

    db.session.delete(allergy)
    db.session.commit()
    return jsonify({"message": f"Allergy: {allergy_name} deleted successfully!"})

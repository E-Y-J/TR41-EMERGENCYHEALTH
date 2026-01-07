from . import conditions_bp
from marshmallow import ValidationError
from flask import request, jsonify
from sqlalchemy import select
from EmergiScan_App.models import Conditions, Patients, db
from EmergiScan_App.utils.util import required_token
from EmergiScan_App.blueprints.conditions.schema import condition_schema, conditions_schema

#Create a Condition
@conditions_bp.route("/", methods=['POST'])
@required_token
def create_condition(patient_id):
    patient = db.session.get(Patients, patient_id)
    if not patient:
        return jsonify({"error": "Sorry, patient does not exist"}), 404
    try:
        data = condition_schema.load(request.json)
    except ValidationError as e:
        return jsonify(e.messages), 400
    
    condition = Conditions(**data, patient_id = patient.id)
    db.session.add(condition)
    db.session.commit()
    return condition_schema.jsonify(condition), 201

#Retrieves a Condition
@conditions_bp.route("/",methods=['GET'])
@required_token
def get_conditions(patient_id):
    patient = db.session.get(Patients, patient_id)
    if not patient:
        return jsonify({"error": "Sorry, patient does not exist"}), 404
    
    query = select(Conditions).where(Conditions.patient_id == patient.id)
    conditions = db.session.execute(query).scalars().all()
    return conditions_schema.jsonify(conditions), 200

#Update a condition
@conditions_bp.route("/<int:condition_id>", methods=['PUT'])
@required_token
def update_condition(patient_id, condition_id):
    patient = db.session.get(Patients, patient_id)
    if not patient:
        return jsonify({"error": "Sorry, patient does not exist"}), 404
    
    condition = db.session.get(Conditions, condition_id)
    if not condition or condition.patient_id != patient.id:
        return jsonify({"error": "Condition not found or unauthorized!"}), 404
    
    try:
        data = condition_schema.load(request.json, partial=True)
    except ValidationError as e:
        return jsonify(e.messages), 400
    
    for key, value in data.items():
        if value not in ("", None): 
            setattr (condition, key, value)
    
    db.session.commit()
    return condition_schema.jsonify(condition)

#Delete condition record for a patient
@conditions_bp.route("/<int:condition_id>",methods=['DELETE'])
@required_token
def delete_condition(patient_id, condition_id):
    patient = db.session.get(Patients, patient_id)
    if not patient:
        return jsonify({"error": "Sorry, patient does not exist"}), 404
    
    condition = db.session.get(Conditions, condition_id)
    if not condition or condition.patient_id != patient.id:
        return jsonify({"error": "Condition not found or unauthorized to delete!"}), 404
    
    db.session.delete(condition)
    db.session.commit()
    return jsonify({"message": f"Condition:{condition_id} deleted successfully!"})




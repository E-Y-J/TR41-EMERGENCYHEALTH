from flask import Blueprint

#Create the blueprint for the patient
patients_bp = Blueprint('patients_bp', __name__)
from . import routes
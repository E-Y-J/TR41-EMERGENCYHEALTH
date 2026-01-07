from flask import Blueprint

#Create the blueprint for the patient
allergies_bp = Blueprint('allergies_bp', __name__)
from . import routes
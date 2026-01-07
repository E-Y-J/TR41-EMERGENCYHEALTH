from flask import Blueprint

#Create the blueprint for the patient
conditions_bp = Blueprint('conditions_bp', __name__)
from . import routes
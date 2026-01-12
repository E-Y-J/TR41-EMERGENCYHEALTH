from flask import Blueprint

#Create the blueprint for the patient
medications_bp = Blueprint('medications_bp', __name__)
from . import routes
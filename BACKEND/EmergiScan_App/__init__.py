from EmergiScan_App.models import db
from flask import Flask
from EmergiScan_App.extensions import ma
from EmergiScan_App.blueprints.patients import patients_bp
from EmergiScan_App.blueprints.allergies import allergies_bp
from EmergiScan_App.blueprints.conditions import conditions_bp

#Here we create the app
def create_app(config_name):
    emergiscan_app = Flask(__name__)
    emergiscan_app.config.from_object(f'config.{config_name}')

    #Add the app to the db Connections and the ma connections
    db.init_app(emergiscan_app)
    ma.init_app(emergiscan_app)
    #cors.init_app(emergiscan_app)

    #Add the blueprints here
    emergiscan_app.register_blueprint(patients_bp, url_prefix="/patients")
    emergiscan_app.register_blueprint(allergies_bp, url_prefix="/allergies")
    emergiscan_app.register_blueprint(conditions_bp, url_prefix="/conditions")
    return emergiscan_app


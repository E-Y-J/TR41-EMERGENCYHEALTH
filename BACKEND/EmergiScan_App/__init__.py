from EmergiScan_App.models import db
from flask import Flask
from EmergiScan_App.extensions import ma
from EmergiScan_App.blueprints.patients import patients_bp
from EmergiScan_App.blueprints.allergies import allergies_bp
from EmergiScan_App.blueprints.conditions import conditions_bp
from EmergiScan_App.blueprints.medications import medications_bp
from flask_swagger_ui import get_swaggerui_blueprint

SWAGGER_URL = '/api/docs'  # URL for exposing Swagger UI (without trailing '/')
API_URL = '/static/swagger.yaml'  # Our API URL (can of course be a local resource)

swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "Emergiscan_app"
    }
)

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
    emergiscan_app.register_blueprint(medications_bp, url_prefix="/medications")
    emergiscan_app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL) #Registering our swagger blueprint

    return emergiscan_app


from EmergiScan_App.models import db
from dotenv import load_dotenv
from flask import Flask
from EmergiScan_App.extensions import ma, cors
from EmergiScan_App.blueprints.patients import patients_bp


load_dotenv()  # Load environment variables from a .env file


# Here we create the app
def create_app(config_name):
    emergiscan_app = Flask(__name__)
    emergiscan_app.config.from_object(f"config.{config_name}")

    # Add the app to the db Connections and the ma connections
    db.init_app(emergiscan_app)
    ma.init_app(emergiscan_app)
    cors.init_app(
        emergiscan_app,
        resources={r"/*": {"origins": "http://localhost:*"}},
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    )

    # Add the blueprints here
    emergiscan_app.register_blueprint(patients_bp, url_prefix="/patients")
    return emergiscan_app

from EmergiScan_App import create_app
from EmergiScan_App.models import db

emergiscan_app = create_app('DevelopmentConfig')
with emergiscan_app.app_context():
    #db.drop_all()
    db.create_all()

if __name__ == "__main__":
    emergiscan_app.run()


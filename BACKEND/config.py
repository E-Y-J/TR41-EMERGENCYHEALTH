import os
import dotenv

dotenv.load_dotenv()
class DevelopmentConfig:
    
    # use environment variables to setup the database connection
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_HOST = os.getenv('DB_HOST')
    DB_PORT = os.getenv('DB_PORT')
    DB_NAME = os.getenv('DB_NAME')
    
    SQLALCHEMY_DATABASE_URI = f'mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}'
    DEBUG = True #updates the file for you so you don't have to rerun every single time    

class TestingConfig:
    pass

class ProductionConfig:
    pass
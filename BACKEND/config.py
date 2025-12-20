import os

class DevelopmentConfig:
    SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://root:Siassaynatt%4008@localhost:3306/emergiscan'
    DEBUG = True #updates the file for you so you don't have to rerun every single time    

class TestingConfig:
    pass

class ProductionConfig:
    pass
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column
from datetime import date
from typing import List
from sqlalchemy import select, ForeignKey

class Base(DeclarativeBase):
    pass

db = SQLAlchemy(model_class=Base)

class Patients(Base):
    __tablename__ = "patients"

    id: Mapped[int] = mapped_column(primary_key=True)
    first_name: Mapped[str] = mapped_column(db.String(100), nullable=False)
    middle_name: Mapped[str] = mapped_column(db.String(100), nullable=True)
    last_name: Mapped[str] = mapped_column(db.String(100), nullable=False)
    email: Mapped[str] = mapped_column(db.String(200), nullable=False, unique=True)
    password: Mapped[str] = mapped_column(db.String(300), nullable=False)
    phone: Mapped[str] = mapped_column(db.String(50), nullable=True, unique=True)
    date_of_birth: Mapped[date] = mapped_column(db.Date, nullable=True)
    gender: Mapped[str] = mapped_column(db.String(10), nullable=True) 
    blood_type: Mapped[str] = mapped_column(db.String(5), nullable=True) #Frontend please enforce rules for these to be filled out in the form I am unable to make it mandatory from my end due to signup reasons
    address: Mapped[str] = mapped_column(db.String(200), nullable=True)
    preferred_hospital: Mapped[str] = mapped_column(db.String(250), nullable=True)
    emergency_contact_name: Mapped[str] = mapped_column(db.String(300), nullable=True) #The emergency contact is not mandatory
    emergency_contact_relationship: Mapped[str] = mapped_column(db.String(150), nullable=True) #The emmergency contact is not mandatory
    emergency_contact_phone: Mapped[str] = mapped_column(db.String(50), nullable=True) #Not mandatory like the name
    allergies: Mapped[List["Allergy"]] = db.relationship(back_populates="patient_allergy")
    health_conditions: Mapped[List["Conditions"]] = db.relationship(back_populates="patient_health_condition")
    medical_record: Mapped[List["Medications"]] =db.relationship(back_populates="patient_medical_record")
    

000

class Allergy(Base):
    __tablename__ = "allergy"

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"))
    allergen: Mapped[str] = mapped_column(db.String(100), nullable=False)
    allergy_type: Mapped[str] = mapped_column(db.String(100), nullable=True) #It is possible that the person does not know the particular type of the allergy so this is not mandatory
    reaction: Mapped[str] = mapped_column(db.String(300), nullable=False) #mandatory because we need to know the reaction to the allergy
    severity: Mapped[str] = mapped_column(db.String(100), nullable=False) #Mandatory, it could help first respond to know the urgency of the matter
    patient_allergy: Mapped["Patients"] = db.relationship(back_populates="allergies")

class Conditions(Base):
    __tablename__ = "conditions"

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"))
    condition_name: Mapped[str] = mapped_column(db.String(150), nullable=True)
    is_chronic: Mapped[str] = mapped_column(db.String(200))
    notes: Mapped[str] = mapped_column(db.String(300), nullable=False)
    patient_health_condition: Mapped["Patients"] = db.relationship(back_populates="health_conditions")

class Medications(Base):
    __tablename__ = "medications"

    id: Mapped[int] = mapped_column(primary_key=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"))
    medication_name: Mapped[str] = mapped_column(db.String(200), nullable=True) #Some people are not on medication so this is not mandatory
    medication_purpose: Mapped[str] = mapped_column(db.String(300), nullable=True)
    dosage: Mapped[str] = mapped_column(db.String(100), nullable=True)
    frequency: Mapped[str] = mapped_column(db.String(100), nullable=True)
    route: Mapped[str] = mapped_column(db.String(200), nullable=True)
    is_active: Mapped[str] = mapped_column(db.String(50), nullable=True) 
    notes: Mapped[str] = mapped_column(db.String(100), nullable=True)
    patient_medical_record: Mapped["Patients"] = db.relationship(back_populates="medical_record")



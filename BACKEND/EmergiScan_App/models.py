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
    
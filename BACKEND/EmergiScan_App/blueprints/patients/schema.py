from EmergiScan_App.models import Patients
from EmergiScan_App.extensions import ma

#Creates the schema that is use for validation, serialization and deserialization
class PatientSchema(ma.SQLAlchemyAutoSchema):
    class Meta: 
        model = Patients
patientschema = PatientSchema()
patients_schema = PatientSchema(many=True)
loginschema = PatientSchema(exclude=['first_name', 'middle_name', 'last_name', 'date_of_birth', 'gender', 'blood_type', 'phone', 'address', 'emergency_contact_name', 'emergency_contact_relationship', 'emergency_contact_phone', "preferred_hospital"])
signupschema = PatientSchema(exclude=['date_of_birth', 'gender', 'blood_type', 'phone', 'address', 'emergency_contact_name', 'emergency_contact_relationship','emergency_contact_phone', "preferred_hospital"])

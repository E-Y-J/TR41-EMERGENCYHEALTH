from EmergiScan_App.models import Medications
from EmergiScan_App.extensions import ma

#Creates the schema that is use for validation, serialization and deserialization
class Medications_Schema(ma.SQLAlchemyAutoSchema):
    class Meta: 
        model = Medications
medication_schema = Medications_Schema()
medications_schema = Medications_Schema(many=True)
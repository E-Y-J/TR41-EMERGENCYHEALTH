from EmergiScan_App.models import Allergy
from EmergiScan_App.extensions import ma

#Creates the schema that is use for validation, serialization and deserialization
class AllergySchema(ma.SQLAlchemyAutoSchema):
    class Meta: 
        model = Allergy
allergyschema = AllergySchema()
allergies_schema = AllergySchema(many=True)
from EmergiScan_App.models import Conditions
from EmergiScan_App.extensions import ma

#Creates the schema that is use for validation, serialization and deserialization
class Conditions_Schema(ma.SQLAlchemyAutoSchema):
    class Meta: 
        model = Conditions
condition_schema = Conditions_Schema()
conditions_schema = Conditions_Schema(many=True)

from sqlalchemy import select
from EmergiScan_App.models import PatientsQRToken, db

def get_or_create_qr_token(patient_id):
    # if there is an existing valid token, return it
    query = select(PatientsQRToken).where(PatientsQRToken.patient_id == patient_id, PatientsQRToken.is_revoked == False)
    existing_token = db.session.execute(query).scalars().first()

    if existing_token:
        return existing_token

    # If no token create a new one
    new_token = PatientsQRToken(
        patient_id = patient_id,
        token = PatientsQRToken.generate_token(),
        is_revoked = False
    )
    db.session.add(new_token)
    db.session.commit()

    return new_token
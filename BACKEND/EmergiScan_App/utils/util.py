import jose
from jose import jwt
from datetime import datetime, timezone, timedelta
from argon2 import PasswordHasher

SECRET_KEY = "we help make emmergency response efficient and reliable"


# Encode token for the user
def encode_token(patient_id):
    payload = {
        "exp": datetime.now(timezone.utc) + timedelta(days=0, hours=1),
        "iat": datetime.now(timezone.utc),
        "sub": str(patient_id),
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token


# Decode token for the user
def decode_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["sub"]
    except jwt.ExpiredSignatureError:
        return None
    except jwt.JWTError:
        return None


# Hash password for user
ph = PasswordHasher()

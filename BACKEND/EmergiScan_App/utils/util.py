import jose
from jose import jwt, JWTError, ExpiredSignatureError
from datetime import datetime, timezone, timedelta
from argon2 import PasswordHasher
from functools import wraps
from flask import request, jsonify

SECRET_KEY = "we help make emmergency response efficient and reliable"
ph = PasswordHasher()


# Create PasswordHasher instance
ph = PasswordHasher()


# Encode token for the user
def encode_token(patient_id):
    payload = {
        "exp": datetime.now(timezone.utc) + timedelta(days=0, hours=1),
        "iat": datetime.now(timezone.utc),
        "sub": str(patient_id),
    }

    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token


#Decode token for the user
def required_token(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split()[1]
            if not token:
                return jsonify({"error": "Missing Token"}), 401
            
            try:
                data = jwt.decode(token, SECRET_KEY, algorithms='HS256')
                patient_id = data['sub']
            except ExpiredSignatureError as e:
                return jsonify({"error": "Expired Signature"}), 401
            except JWTError as e:
                return jsonify({"error": "Invalid Token"}), 401 #401 triggers unauthorized errors
            return f(patient_id, *args, **kwargs)
        else:
            return jsonify({"error": "You need to be Logged in to access this"}), 401
        
    return decorated 


# TR41-EMERGENCYHEALTH

Task(Ali):
requirements.txt - Updated package versions and added missing dependencies
config.py - Changed from hardcoded credentials to environment variables
**init**.py - Added dotenv import and loading
.env - Created with local MySQL credentials (gitignored)
.env.example - Created as template for team

Task(Ali):Qrcode
- create qr-token table in models.py
- create get_or_create_qr_token function in qr.py
- update login route in routes/auth.py to add qr-token url to response 
######################################################################

# TR41-EMERGENCYHEALTH

Task1(Ali): Environment Variables
requirements.txt - Updated package versions and added missing dependencies
config.py - Changed from hardcoded credentials to environment variables
**init**.py - Added dotenv import and loading
.env - Created with local MySQL credentials (gitignored)
.env.example - Created as template for team

Task2(Ali):Qrcode

- implement qr-token table in models.py
- implement get_or_create_qr_token function in qr.py
- modified the login route to include qrURL and is_revoked status in the response

task3(Ali): QR-token 
- Updated Patients model to include relationship with QRToken
- implemented route to revoke patient QR token
- added error handling for QR token revocation

task4(Ali): responders chat
- updated the /me route to include qr_token revocation status
- added create_at in the qr_token model

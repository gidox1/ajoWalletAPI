# ajoWalletAPI

This is a mini-wallet system 

To run, you must have docker installed on your machine. preferably Version 17.12.0-ce-mac55
Once installed, run ./bin/start.sh in your terminal.
This should spin up a disposable app conntainer.

Another script that can be cound there is the clean.sh, which when run with the command
./bin/clean.sh will stop all containers created with a predefined image.

The app is built in such a way that way that notable actions have their own custom routes and test ca be done 
via postman.

The endpoints currently on the app as at this time are:
=> Agent Registration
=> Agent Login
=> Agent Wallet Credit (unfinished)
=> get OTP for Payment Verification.

Registratin (POST): Returns a success or failure status
Sample Payload = {
	"first_name":"kanu",
	"last_name":"nkw",
	"email": "kanu@gmail.com",
	"address": "445, Ijaye road",
	"password": 1234,
	"city": "Lagos",
	"state": "Lagos",
	"lga": "Nigeria",
	"dob": "1994-02-7",
	"sex": "male"
}

Login (POST): Returns a token on successful logIn and a fail otherwise
Sample Payload = {
	"email": "kanu@gmail.com",
	"password" : "1234"
}


Credit (POST): (unfinished) : The routed is protected, so the token generated on login must be supplied as a parm with the key "access_token"
SamplePayload = {
	"amount": 5000,
	"reference_number": "ajolscQF147h",
	"pin": 1234,
	"otp": 5328
}

getOtp (GET): Returns a four digit OTP on success and a fail otherwise


This app requires a .env file for secrets and db configs (production scenario).
It aslo requires a database.

'use strict';

const AgentModel = require('../models/agent');
const OtpModel = require('../models/otp');
const WalletModel = require('../models/wallet');
const constants = require('../constants');
const Auth = require('../auth');
const WalletService = require('./wallet');
const wallet = new WalletService();
const auth = new Auth();
const _ = require('lodash');
const operand = constants.operandEquals;


class AgentService 
{
    /**
    * Handles User Creation
    */
    async register (data, allowed_keys) {   
            const agentData = await _.pick(data, allowed_keys);
            const reference_number = await constants.generateReferenceNumber();
            const email = agentData.email;
            const password = agentData.password.toString();
            const hashedPassword = await auth.hashPassword(password);
            agentData.password = await hashedPassword;
            
            const agentCheck = await this.checkUser('email', operand, email);
            const parsedObject = JSON.parse(JSON.stringify(agentCheck));
            agentData.reference_number = reference_number;

            if(parsedObject.length < 1 || parsedObject == null) {
                wallet.create(reference_number);
                return new Promise(async (resolve, reject) => {
                    return new AgentModel()
                    .save(agentData, {method: 'insert'})
                    .then(Response => {
                        console.log('Agent details saved')
                        return resolve({
                            status: true,
                            body: Response
                        })
                    })
                    .catch(err => {
                        console.log(err);
                    })
                })
            }

            //createWallet
            if(parsedObject[0].email) {return {status: false, message: 'Agent already exits'}};
    }


    /**
    * Handles User Log in
    */
    async login(email, password) {
        const params = {email, password};
        const agentCheck = await this.checkUser('email', operand, email);
        const parsedObject = JSON.parse(JSON.stringify(agentCheck));
        const userEmail = parsedObject[0].email;
        const userPassword = await parsedObject[0].password;
        const checkParams ={email: userEmail, password: userPassword };
        const compare = await auth.comparePassword(password, userPassword);

        if(compare === true) {
            const userToken = await auth.getToken(params, checkParams, parsedObject);
            return {
                status: true,
                token: userToken
            }
        } else {
            return {status: false, message: 'Invalid email or password'}
        }
    }

    async getOtp(reference_number) {
        const generatedOtp = await constants.otpGenerator();
        const data = {reference_number, generatedOtp}
        new OtpModel().saveOtp(data);
        return {
            status: true,
            otp: generatedOtp
        }
    }

    async credit(amount, reference_number, pin, otp, userObjectFromToken) {
        const email = userObjectFromToken.email;
        const sentPassword = pin.toString();
        const agentCheck = await this.checkUser('email', operand, email);
        const parsedObject = JSON.parse(JSON.stringify(agentCheck));
        const userPassword = await parsedObject[0].password;
        const checkParams ={email: email, password: userPassword };
        const compare = await auth.comparePassword(sentPassword, userPassword);
        const senderRefNum = userObjectFromToken.reference_number

        if(compare === true) {
            const trans = await new OtpModel().findOtp('agent_reference_number', operand, senderRefNum);
            const parsedObject = JSON.parse(JSON.stringify(trans));
            const retrievedOtp = parsedObject[0].otp;

            if(retrievedOtp != otp) {
                return {status: false, message: 'Invalid otp supplied'}
            }

            const recepientWallet = await new WalletModel().findWallet('reference_number', operand, reference_number);
            const parsedWallet = JSON.parse(JSON.stringify(recepientWallet));
            console.log(parsedWallet);

            // const newAmount = 

        } else {
            return {status: false, message: 'Invalid email or password'}
        }

    }

    /**
    * Checks User in DB
    */
    async checkUser (condition, operand, data) {
        return new Promise(async (resolve, reject) => {
            const userModel =  await new AgentModel()
            .findUser(condition, operand, data)
            return resolve(userModel);
        })
    }

} 

module.exports = AgentService;
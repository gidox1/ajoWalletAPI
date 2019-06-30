'use strict';

const AgentModel = require('../models/agent');
const OtpModel = require('../models/otp');
const WalletModel = require('../models/wallet');
const TransactionModel = require('../models/transaction_log');
const constants = require('../constants');
const Auth = require('../auth');
const WalletService = require('./wallet');
const wallet = new WalletService();
const auth = new Auth();
const _ = require('lodash');
const operand = constants.operandEquals;
const action = constants.actionCredit;


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
            const parsedObject = constants.parseJSON(agentCheck);
            agentData.reference_number = reference_number;

            if(parsedObject.length < 1 || parsedObject == null) {
                await wallet.create(reference_number);
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
            if(parsedObject[0].email) {return {status: false, message: 'Agent already exits'}};
    }


    /**
    * Handles User Log in
    */
    async login(email, password) {
        const params = {email, password};
        const agentCheck = await this.checkUser('email', operand, email);
        const parsedObject = constants.parseJSON(agentCheck);
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
        const parsedObject = constants.parseJSON(agentCheck);
        const userPassword = await parsedObject[0].password;
        const checkParams ={email: email, password: userPassword};
        const compare = await auth.comparePassword(sentPassword, userPassword);
        const senderRefNum = userObjectFromToken.reference_number

        if(compare === true) {
            const trans = await new OtpModel().findOtp('agent_reference_number', operand, senderRefNum);
            const parsedObject = constants.parseJSON(trans);
            const retrievedOtp = parsedObject[0].otp;

            if(retrievedOtp != otp) {
                console.log('invalid otp')
                return {status: false, message: 'Invalid otp supplied'}
            }

            const recepientWallet = await new WalletModel().findWallet('reference_number', operand, reference_number);
            const parsedWallet = constants.parseJSON(recepientWallet);

            if(parsedWallet.length < 1 || parsedWallet == null) {
                return {status: false, message: 'reference_number does not exist'}
            };

            const recepientReferenceNumber = reference_number;
            const transactionStatus = await wallet.validateTransaction({amount, senderRefNum});

            if(transactionStatus == true) {
                const current_balance = parsedWallet[0]['current_balance'] + amount;
                const previous_balance = parsedWallet[0]['current_balance'];
                return new WalletModel().updateWallet({current_balance, previous_balance, reference_number})
                    .then(async (transactionResponse) => {
                        new TransactionModel().logTransaction({senderRefNum, amount, action, recepientReferenceNumber, status: transactionResponse.status});

                        if(transactionResponse.status == 'success') {
                            const sendersWallet = await new WalletModel().findWallet('reference_number', operand, senderRefNum);
                            const walletDetails = constants.parseJSON(sendersWallet);

                            const sendersCurrentBalance = walletDetails[0]['current_balance'] - amount;
                            const sendersPreviousBalance = walletDetails[0]['current_balance'];
                            return await new WalletModel().updateWallet({current_balance: sendersCurrentBalance, previous_balance: sendersPreviousBalance, reference_number: senderRefNum})
                                .then(update => {
                                    return (update.status == 'success') ? {status: true, message: 'Credit Successful'} 
                                    : {status: false, message: constants.failedTransactionMessage}
                                })
                                .catch(err => {
                                    throw err;
                                })
                        }
                    })
                    .catch(error => {
                        throw error;
                    })
            }
                return {status: false, message: 'Insufficient Funds. Go and hammer'}
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
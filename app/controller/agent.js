'use strict';

const allowed_keys = require('../constants').allowed_keys;
const registerService = require('../service/agent');
const service = new registerService();

class Agent 
{

    /**
    * Handles User Creation
   */
    async register(req, res) 
    {
        const payload = req.body;
        const filter_params = allowed_keys;
        return await service.register(payload, filter_params)
            .then(serviceResponse => {
                return (serviceResponse.status === true) ? res.status(200).json({status: 'success', message: 'successfully created agent'})
                    : res.status(409).json({status: 'error', message: serviceResponse.message})
            })
            .catch(err => {
                throw err;
            })
    }


    /**
    * Handles User Log in
    */
    async login(req, res) 
    {
        const {email, password} = req.body;
        return await service.login(email, password)
            .then(serviceResponse => {
                return (serviceResponse.status === true) ? res.status(200).json({status: 'success', message: 'successfully Logged in', access_token: serviceResponse.token})
                    : res.status(409).json({status: 'error', message: serviceResponse.message})
            })
            .catch(err => {
                throw err;
            })
    }



    async credit(req, res) {
        const userObjectFromToken = res.locals.user.payload[0];
        const {amount, reference_number, pin, otp} = req.body;
        return await service.credit(amount, reference_number, pin, otp, userObjectFromToken);
        // .then(serviceResponse => {
        //     return (serviceResponse.status === true) ? res.status(200).json({status: 'success', message: 'successfully Logged in', access_token: serviceResponse.token})
        //         : res.status(409).json({status: 'error', message: serviceResponse.message})
        // })            
        // .catch(err => {
        //     throw err;
        // })
    }

    async getOtp(req, res) {
        const reference_number = res.locals.user.payload[0].reference_number;
        return await service.getOtp(reference_number)
            .then(otpResponse => {
                (otpResponse.status === true) ? res.status(200).json({status:'success', otp: otpResponse.otp}) : 
                    res.status(409).json({status: 'fail'});
            })
    }
} 

module.exports = Agent
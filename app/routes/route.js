'use strict';

const express = require('express');
const router = express.Router();
const agentController = require('../utils').agentController;
const Auth = require('../auth');
const auth = new Auth();

router.post('/register',  (req, res) => {
    agentController.register(req, res);
});

router.post('/login',  (req, res) => {
    agentController.login(req, res);
});

router.get('/getOtp', auth.VerifyToken, (req, res) => {
    agentController.getOtp(req, res);
});

router.post('/credit', auth.VerifyToken, (req, res) => {
    agentController.credit(req, res);
});

module.exports = router;
'use strict';

const allowed_keys = ['first_name', 'last_name','email', 'password', 'address', 'state', 'lga', 'city' ];
const operandEquals = '=';
const prefix = 'ajo';
const shortId = require('shortid');
const agentActive = 1;
const agentBlocked =0;
const actionCredit = 'credit';
const actionDebit = 'debit';
const failedTransactionMessage = 'Unable to complete transaction. Please try again later';

function generateReferenceNumber() {;
    const refNum = prefix + shortId.generate();
    return refNum;
}

function otpGenerator() {
    const randomOtp = Math.floor(1000 + Math.random() * 9000);
    return randomOtp;
}

function parseJSON(objectModel) {
    return JSON.parse(JSON.stringify(objectModel));
}

module.exports = {
    allowed_keys,
    operandEquals,
    prefix,
    generateReferenceNumber,
    agentActive,
    agentBlocked,
    otpGenerator,
    parseJSON,
    actionCredit,
    actionDebit,
    failedTransactionMessage
}

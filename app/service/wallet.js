'use strict';

const WalletModel = require('../models/wallet');
const StatusModel = require('../models/status');
const constants = require('../constants');
const operand = constants.operandEquals;

class Wallet {

    async create (referenceNumber) {
        const current_balance = parseFloat(0).toFixed(2);
        const previous_balance = parseFloat(0).toFixed(2);
        const reference_number = referenceNumber;
        const data = {reference_number,current_balance, previous_balance}
        await new StatusModel().setStatusActive();

        return new WalletModel()
                .save(data)
                .then(Response => {
                    return {
                        status: true,
                        body: Response
                    }
                })
                .catch(err => {
                    throw err;
                })
    }

    async validateTransaction (transaction) {
        const {amount, senderRefNum} = transaction;
        const senderWalletDetails = await new WalletModel().findWallet('reference_number', operand, senderRefNum);
        const parsedObject = constants.parseJSON(senderWalletDetails);
        const senderBalance = parsedObject[0]['current_balance'];

        if(amount > senderBalance) {
            return false;
        }
        return true;
    }
}

module.exports = Wallet;
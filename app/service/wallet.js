'use strict';

const WalletModel = require('../models/wallet');
const StatusModel = require('../models/status');

class Wallet {

    async create (referenceNumber) {
        const current_balance = 0.00;
        const previous_balance = 0.00;
        const reference_number = referenceNumber;
        const data = {reference_number,current_balance, previous_balance}
        new StatusModel().setStatusActive();

        return new WalletModel()
                .save(data, {method: 'insert'})
                .then(Response => {
                    console.log('Wallet details saved')
                    return {
                        status: true,
                        body: Response
                    }
                })
                .catch(err => {
                    throw err;
                })
    }
}

module.exports = Wallet;
'use strict';

const bookshelf = require('../bookshelf');

let Wallet = bookshelf.Model.extend({
    tableName: 'wallet',
    hasTimestamps: true,

    findWallet: async (condition, operand, data) => {
        console.log('within model');
            return await new Wallet()
            .query((qb) => {
                qb.where(condition, operand, data)
                qb.debug(true)
            })
            .fetchAll();
    },

    creditWallet: (payload) => {
        return new Wallet()
            .save({otp : generatedOtp , agent_reference_number: reference_number}, {method: 'insert'})
            .then(() => {
                console.log('Wallet Credited');
            })
            .catch(err => {throw err})
    },
})

module.exports = bookshelf.model('Wallet', Wallet);
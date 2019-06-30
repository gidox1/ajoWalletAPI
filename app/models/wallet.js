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
            })
            .fetchAll();
    },

    updateWallet: (payload) => {
        const {current_balance, previous_balance, reference_number} = payload;
        return new Wallet()
            .where({reference_number: reference_number})
            .save({current_balance: current_balance, previous_balance: previous_balance}, {method: 'update', patch: true})
            .then(() => {
                return {status: 'success', message: 'wallet updated', };
            })
            .catch(err => {
                return {status: 'failed', message: err};
            })
    },

})

module.exports = bookshelf.model('Wallet', Wallet);
'use strict';

const bookshelf = require('../bookshelf');

let Transaction = bookshelf.Model.extend({
    tableName: 'transaction_log',
    hasTimestamps: true,

    findTransaction: async (condition, operand, data) => {
        return await new Transaction()
        .query((qb) => {
            qb.where(condition, operand, data)
        })
        .fetchAll();
    },

    logTransaction: async (transaction) => {
        const {senderRefNum, amount, action, recepientReferenceNumber} = transaction;

        return await new Transaction()
            .save({reference_number: senderRefNum, amount, action, receiver_wallet_id: recepientReferenceNumber}, {method: 'insert'})
            .then(() => {
                console.log('Transaction Logged');
            })
            .catch(err => {throw err})
    }
})

module.exports = bookshelf.model('Transaction', Transaction);
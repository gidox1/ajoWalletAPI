'use strict';

const bookshelf = require('../bookshelf');

let Transaction = bookshelf.Model.extend({
    tableName: 'transaction_log',
    hasTimestamps: true,

    findTransaction: async (condition, operand, data) => {
            return await new Transaction()
            .query((qb) => {
                qb.where(condition, operand, data)
                qb.debug(true)
            })
            .fetchAll();
    }
})

module.exports = bookshelf.model('Transaction', Transaction);
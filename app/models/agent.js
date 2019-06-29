'use strict';

const bookshelf = require('../bookshelf');

let Agent = bookshelf.Model.extend({
    tableName: 'agents',
    hasTimestamps: true,

    saveData: async (payload) => {
        return new Agent()
            .save(payload, {method: 'insert'})
            .then(serviceResponse => {
                console.log('SERVICE', serviceResponse);
            })
            .catch(err => {
                console.log('an error occured within model', err);
            })
    },

    findUser: async (condition, operand, data) => {
            return await new Agent()
            .query((qb) => {
                qb.where(condition, operand, data)
                qb.debug(true)
            })
            .fetchAll();
    }
})

module.exports = bookshelf.model('Agent', Agent);
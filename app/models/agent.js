'use strict';

const bookshelf = require('../bookshelf');

let Agent = bookshelf.Model.extend({
    tableName: 'agents',
    hasTimestamps: true,

    saveData: async (payload) => {
        return new Agent()
            .save(payload, {method: 'insert'})
            .then(serviceResponse => {
                console.log(serviceResponse);
            })
            .catch(err => {
                console.log('an error occured within model', err);
            })
    },

    findUser: async (condition, operand, data) => {
            return await new Agent()
            .query((qb) => {
                qb.where(condition, operand, data)
            })
            .fetchAll();
    }
})

module.exports = bookshelf.model('Agent', Agent);
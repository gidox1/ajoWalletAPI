'use strict';

const bookshelf = require('../bookshelf');

let Otp = bookshelf.Model.extend({
    tableName: 'otp',
    hasTimestamps: true,

    findOtp: async (condition, operand, data) => {
            return await new Otp()
            .query((qb) => {
                qb.where(condition, operand, data)
            })
            .fetchAll();
    },

    saveOtp: (payload) => {
        const {generatedOtp, reference_number} = payload;
        return new Otp()
            .save({otp : generatedOtp , agent_reference_number: reference_number}, {method: 'insert'})
            .then(() => {
                console.log('otp saved');
            })
            .catch(err => {throw err})
    },

})

module.exports = bookshelf.model('Otp', Otp);
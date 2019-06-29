'use strict';

const bookshelf = require('../bookshelf');
const constants = require('../constants');

let Status = bookshelf.Model.extend({
    tableName: 'status',
    hasTimestamps: true,

    setStatusActive: () => {
        const status = constants.agentActive;
        return new Status()
            .save({status: status}, {method: 'insert'})
            .then(() => {
                console.log('status updated');
            })
            .catch(err => {throw err})
    },

    setStatusBlocked: () => {
        const status = constants.agentActive;
        return new Status()
            .save(status, {mekthod: 'insert'})
            .then(() => {
                console.log('status updated');
            })
            .catch(err => {throw err})
    },

})

module.exports = bookshelf.model('Status', Status);
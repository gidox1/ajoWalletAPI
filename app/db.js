'use strict';

let config = require('./config');

let knex = require('knex')({
    client: 'mysql',
    connection: config.mysql.connection,
    ssl: true,
    migrations: {
        tableName: 'migrations'
    },
    pool: config.mysql.pool
});

module.exports = knex;

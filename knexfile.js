var config = require('./app/config');

var dbConfig = {
    client: 'mysql',
    connection: config.mysql.connection,
    pool: config.mysql.pool,
    migrations: {
        tableName: 'migrations'
    },
    debug: true
};

module.exports = dbConfig;

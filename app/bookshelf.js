'use strict';

let knex = require('./db');
let bookshelf = require('bookshelf')(knex);

// Resolve circular dependencies with relations
bookshelf.plugin('registry');

// Hide attributes when calling toJSON
bookshelf.plugin('visibility');

module.exports = bookshelf;

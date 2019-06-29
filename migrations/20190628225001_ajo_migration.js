
exports.up = function(knex) {
    return knex.schema
      .createTableIfNotExists('agents', function(table) {
          table.increments('id').primary();
          table.string('first_name').notNullable();
          table.string('last_name').notNullable();
          table.string('email').notNullable();
          table.string('city').notNullable();
          table.string('lga').notNullable();
          table.string('state').notNullable();
          table.string('address').notNullable();
          table.string('password').notNullable();
          table.uuid('reference_number').notNullable();
          table.timestamps();
      })
      .createTableIfNotExists('status', function(table) {
        table.increments('id').primary();
        table.integer('status').notNullable();
        table.timestamps();
      })
      .createTableIfNotExists('otp', function(table) {
        table.increments('id').primary();
        table.integer('otp').notNullable();
        table.uuid('agent_reference_number').notNullable();
        table.timestamps();
      })
      .createTableIfNotExists('wallet', function(table) {
        table.increments('id').primary();
        table.integer('current_balance').notNullable();
        table.integer('previous_balance').notNullable();
        table.uuid('reference_number').notNullable();
        table.timestamps();
      })
      .createTableIfNotExists('transaction_log', function(table) {
        table.increments('id').primary();
        table.uuid('reference_number').notNullable();
        table.integer('amount').notNullable();
        table.string('action').notNullable();
        table.string('receiver_wallet_id').notNullable();
        table.timestamps();
      })

  };
  
  exports.down = function(knex) {
    return knex.schema
      .dropTableIfExists('agents')
      .dropTableIfExists('agent_wallet')
      .dropTableIfExists('status')
      .dropTableIfExists('wallet')
      .dropTableIfExists('otp')
      .dropTableIfExists('transaction_log')
    };
  
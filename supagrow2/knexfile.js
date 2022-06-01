// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
 module.exports = {

    development: {
      client: 'mysql2',
      connection: {
        database: 'supagrow2',
        user:     'kumar',
        password: 'Sampath@123'
      },
      pool: {
        min: 2,
        max: 10
      },
      migrations: {
        tableName: 'knex_migrations'
      }
    }

  };

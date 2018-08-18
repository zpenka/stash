const config = require('config');

module.exports = {
  client: 'pg',
  connection: {
    host: config.database.host,
    database: config.database.database,
    user: config.database.user,
    password: config.database.password,
    ssl: config.database.ssl,
  },
  migrations: {
    directory: `${__dirname}/db/migrations`
  },
};

exports.up = function(knex) {
  const sql = `
    DROP TABLE IF EXISTS venues;
    CREATE TABLE venues (
      id SERIAL PRIMARY KEY NOT NULL,
      identifier VARCHAR(255) NOT NULL UNIQUE,
      country VARCHAR(10) NOT NULL,
      province VARCHAR(5) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;

  return knex.raw(sql);
};

exports.down = function(knex) {
  const sql = `
    DROP TABLE venues
  `;

  return knex.raw(sql);
};

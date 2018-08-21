exports.up = function(knex) {
  const sql = `
    DROP TABLE IF EXISTS sets;
    CREATE TABLE sets (
      id SERIAL PRIMARY KEY NOT NULL,
      identifier VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;

  return knex.raw(sql);
};

exports.down = function(knex) {
  const sql = `
    DROP TABLE sets
  `;

  return knex.raw(sql);
};

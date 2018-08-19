exports.up = function(knex) {
  const sql = `
    DROP TABLE IF EXISTS shows;
    CREATE TABLE shows (
      id SERIAL PRIMARY KEY NOT NULL,
      date VARCHAR(10) NOT NULL UNIQUE,
      year INT NOT NULL,
      month INT NOT NULL,
      day INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;

  return knex.raw(sql);
};

exports.down = function(knex) {
  const sql = `
    DROP TABLE shows
  `;

  return knex.raw(sql);
};

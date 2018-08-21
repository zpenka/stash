exports.up = function(knex) {
  const sql = `
    DROP TABLE IF EXISTS song_performances;
    CREATE TABLE song_performances (
      id SERIAL PRIMARY KEY NOT NULL,
      song_id INT NOT NULL,
      set_id INT NOT NULL,
      show_id INT NOT NULL,
      song_number_in_set INT NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE (show_id, set_id, song_id, song_number_in_set)
    )
  `;

  return knex.raw(sql);
};

exports.down = function(knex) {
  const sql = `
    DROP TABLE song_performances
  `;

  return knex.raw(sql);
};

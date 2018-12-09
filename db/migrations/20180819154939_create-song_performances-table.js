exports.up = function(knex) {
  const sql = `
    DROP TABLE IF EXISTS song_performances;
    CREATE TABLE song_performances (
      id SERIAL PRIMARY KEY NOT NULL,
      song_id INT NOT NULL,
      set_id INT NOT NULL,
      show_id INT NOT NULL,
      song_number_in_set INT NOT NULL,
      url VARCHAR(255) DEFAULT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE (show_id, set_id, song_id, song_number_in_set)
    );
    CREATE INDEX ix_song_performances_song_id ON song_performances (song_id);
    CREATE INDEX ix_song_performances_set_id ON song_performances (set_id);
    CREATE INDEX ix_song_performances_show_id ON song_performances (show_id);
    CREATE INDEX ix_song_performances_song_number_in_set ON song_performances (song_number_in_set);
  `;

  return knex.raw(sql);
};

exports.down = function(knex) {
  const sql = `
    DROP TABLE song_performances
  `;

  return knex.raw(sql);
};

const moment = require('moment');
const P = require('bluebird');

const phishin = require('./phishin');
const db = require('../db');

const findOrCreateVenue = (show) => {
  const findVenue = (show) => {
    return db('venues')
    .select()
    .where({ identifier: show.venue.identifier });
  };

  const createVenue = (show) => {
    const venue = {
      identifier: show.venue.identifier,
      country: show.venue.country,
      province: show.venue.province,
    };

    return db
    .insert(venue)
    .into('venues');
  };

  return createVenue(show)
  .then(() => show)
  .catch((err) => {
    if (err.constraint && err.constraint.match(/venues_identifier_key/)) {
      // Venue already exists
      return findVenue(show).then((rows) => {
        if (rows.length !== 1) {
          throw new Error(`Unexpected number of rows in database for venue: ${rows.length}`);
        }

        return show;
      });
    }

    throw err;
  });
};

const findOrCreateShow = (show) => {
  const getIdForVenue = (show) => {
    return db('venues')
    .select('id')
    .where({ identifier: show.venue.identifier })
    .then((result) => result[0].id);
  };

  const findShow = (show) => {
    return db('shows')
    .select()
    .where({ date: show.date });
  };

  const createShow = (show) => {
    const showDate = moment(show.date);
    const date = showDate.format('YYYY-MM-DD');
    const year = showDate.year();
    const month = showDate.month() + 1; // moment months are 0 indexed
    const day = showDate.date();

    return getIdForVenue(show).then((venueId) => {
      const show = {
        date,
        year,
        month,
        day,
        venue_id: venueId,
      };

      return db
      .insert(show)
      .into('shows');
    });
  };

  return createShow(show)
  .then(() => show)
  .catch((err) => {
    if (err.constraint && err.constraint.match(/shows_date_key/)) {
      // Show already exists
      return findShow(show).then((rows) => {
        if (rows.length !== 1) {
          throw new Error(`Unexpected number of rows in database for show: ${rows.length}`);
        }

        return show;
      });
    }

    throw err;
  });
};

const findOrCreateSets = (show) => {
  const findSet = (identifier) => {
    return db('sets')
    .select()
    .where({ identifier });
  };

  const createSet = (identifier) => {
    const set = { identifier };

    return db('sets')
    .insert(set);
  };

  const setIdentifiers = Object.keys(show.setlist);
  return P.each(setIdentifiers, (setIdentifier) => {
    return createSet(setIdentifier)
    .catch((err) => {
      if (err.constraint && err.constraint.match(/sets_identifier_key/)) {
        // Set already exists
        return findSet(setIdentifier).then((rows) => {
          if (rows.length !== 1) {
            throw new Error(`Unexpected number of rows in database for set: ${rows.length}`);
          }
        });
      }

      throw err;
    });
  }).then(() => show);
};

const findOrCreateSongs = (show) => {
  const findSong = (identifier) => {
    return db('songs')
    .select()
    .where({ identifier });
  };

  const createSong = (identifier) => {
    const song = { identifier };

    return db('songs')
    .insert(song);
  };

  const songIdentifiers = Object.values(show.setlist);
  return P.each(songIdentifiers, (setOfSongs) => {
    if (setOfSongs.length && setOfSongs.length > 0) {
      return P.each(setOfSongs, (song) => {
        return createSong(song)
        .catch((err) => {
          if (err.constraint && err.constraint.match(/songs_identifier_key/)) {
            // Song already exists
            return findSong(song).then((rows) => {
              if (rows.length !== 1) {
                throw new Error(`Unexpected number of rows in database for song: ${rows.length}`);
              }
            });
          }

          throw err;
        });
      });
    }

    throw new Error(`Unknown data structure for set: ${setOfSongs}`);
  }).then(() => show);
};

const findOrCreateSongPerformances = (show) => {
  const createSongPerformance = (songIdentifier, setIdentifier, songNumber, showDate) => {
    const getSongId = (identifier) => {
      return db('songs')
      .where({ identifier })
      .then((result) => result[0].id);
    };

    const getSetId = (identifier) => {
      return db('sets')
      .where({ identifier })
      .then((result) => result[0].id);
    };

    const getShowId = (date) => {
      return db('shows')
      .where({ date })
      .then((result) => result[0].id);
    };

    return P.all([
      getSongId(songIdentifier),
      getSetId(setIdentifier),
      getShowId(showDate)
    ]).spread((songId, setId, showId) => {
      const songPerformance = {
        song_id: songId,
        set_id: setId,
        show_id: showId,
        song_number_in_set: songNumber
      };

      return db('song_performances')
      .insert(songPerformance);
    });
  };

  const setIdentifiers = Object.keys(show.setlist);
  const showDate = show.date;

  return P.each(setIdentifiers, (setIdentifier) => {
    const songIdentifiers = show.setlist[setIdentifier];

    return P.each(songIdentifiers, (songIdentifier) => {
      const songNumber = songIdentifiers.indexOf(songIdentifier) + 1;
      return createSongPerformance(songIdentifier, setIdentifier, songNumber, showDate)
      .catch((err) => {
        if (err.constraint && err.constraint.match(/song_performances_show_id_set_id_song_id_song_number_in_set_key/)) {
          // Song performance already logged
          return;
        }

        throw err;
      });
    });
  })
  .then(() => show);
};

exports.sync = (date) => {
  return phishin.getShow(date)
  .then(findOrCreateVenue)
  .then(findOrCreateShow)
  .then(findOrCreateSets)
  .then(findOrCreateSongs)
  .then(findOrCreateSongPerformances)
  .then(() => {
    return {
      success: true,
      reason: '',
    };
  })
  .catch((err) => {
    const reason = err.message;

    return {
      success: false,
      reason,
    };
  });
};

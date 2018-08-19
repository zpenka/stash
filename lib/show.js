const moment = require('moment');

const net = require('./net');
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

exports.sync = (date) => {
  return net.getShow(date)
  .then(findOrCreateVenue)
  .then(findOrCreateShow)
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

const moment = require('moment');

const net = require('./net');
const db = require('../db');

const findOrCreateShow = (show) => {
  const findShow = (show) => {
    return db
    .select()
    .from('shows')
    .where({ date: show.date });
  };

  const createShow = (show) => {
    const showDate = moment(show.date);
    const date = showDate.format('YYYY-MM-DD');
    const year = showDate.year();
    const month = showDate.month() + 1; // moment months are 0 indexed
    const day = showDate.date();

    return db
    .insert({ date, month, day, year })
    .into('shows');
  };

  return createShow(show).catch((err) => {
    if (err.constraint && err.constraint.match(/shows_date_key/)) {
      // Show already exists
      return findShow(show);
    }

    throw err;
  });
};

exports.sync = (date) => {
  return net.getShow(date)
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

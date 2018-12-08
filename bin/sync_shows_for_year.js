const P = require('bluebird');
const cli = require('cli');

const log = require('../lib/log');
const phishin = require('../lib/phishin');
const show = require('../lib/show');

const options = cli.parse({
  year: ['y', 'Year to sync', 'int', false],
  sleepTime: ['s', 'Seconds to sleep between syncs', 'int', 60],
});

if (!options.year) {
  log.error('You must supply a year to sync');
  cli.getUsage();

  process.exit(1);
}

const sleep = options.sleepTime * 1000;
if (!sleep) {
  log.error('Sleep cannot be 0');
  cli.getUsage();

  process.exit(1);
}

const syncShowsForYear = (year) => {
  return phishin.getShowsForYear(year).then((showDates) => {
    return P.each(showDates, (showDate) => {
      return show.sync(showDate)
      .then(() => {
        return P.delay(sleep);
      });
    });
  })
  .then(() => {
    log.info(`All shows successfully synced for year ${year}`);

    process.exit(0);
  })
  .catch((err) => {
    log.error(err);

    process.exit(1);
  });
};

syncShowsForYear(options.year);

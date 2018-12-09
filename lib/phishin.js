const request = require('request-promise');
const config = require('config');
const Moment = require('moment');

const baseUrl = config.phishin.baseUrl;

exports.getYears = () => {
  const options = {
    json: true,
    uri: `${baseUrl}/years`,
  };

  return request.get(options).then((result) => {
    if (!result.success) {
      throw new Error('Could not get years');
    }

    return result.data.filter((year) => {
      if (year.length === 4) {
        return true;
      }

      return false;
    });
  });
};

exports.getShowIdsForYear = (year) => {
  const options = {
    json: true,
    uri: `${baseUrl}/years/${year}`,
  };

  return request.get(options).then((result) => {
    if (!result.success) {
      throw new Error('Could not get show data for year');
    }

    return result.data.map((row) => row.id);
  });
};

exports.getShow = (showId) => {
  const options = {
    json: true,
    uri: `${baseUrl}/shows/${showId}`,
  };

  return request.get(options).then((result) => {
    const showData = result.data;

    const getEra = (showDate) => {
      const showDateMoment = new Moment(showDate);
      if (showDateMoment.isBefore(new Moment('2000-11-01'))) {
        return '1.0';
      } else if (showDateMoment.isBefore(new Moment('2004-12-31'))) {
        return '2.0';
      }

      return '3.0';
    };

    const date = showData.date;
    const era = getEra(date);
    const venue = {
      identifier: showData.venue.name,
      country: 'usa', // TODO: Hardcoded for now, will fix later
      location: showData.venue.location,
    };

    const setlist = {};
    showData.tracks.forEach((performance) => {
      const set = performance.set;
      if (!setlist[set]) {
        setlist[set] = [];
      }

      setlist[set].push({
        title: performance.title,
        url: performance.mp3,
      });
    });

    return { date, era, venue, setlist };
  });
};

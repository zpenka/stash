const request = require('request-promise');
const config = require('config');

const baseUrl = config.phishin.baseUrl;

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

    const date = showData.date;

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

      setlist[set].push(performance.title);
    });

    return { date, venue, setlist };
  });
};

const request = require('request-promise');
const config = require('config');
const parse = require('himalaya').parse;
const error = require('./error');

const apikey = config.net.apikey;
const baseUrl = config.net.baseUrl;

exports.getShow = (date) => {
  const options = {
    json: true,
    uri: `${baseUrl}/setlists/get`,
    qs: {
      apikey,
      showdate: date,
    },
  };

  return request.get(options).then((result) => {
    const setlistData = result.response.data[0].setlistdata;
    const showDate = result.response.data[0].showdate;
    const locationParts = result.response.data[0].location.split(',');
    const province = locationParts[1].trim().toLowerCase();
    const country = locationParts[2].trim().toLowerCase();
    const venueParts = result.response.data[0].venue.split(/\//);
    const venueIdentifier = venueParts[venueParts.length - 2].split('"')[0].replace(/_/g, ' ');

    const venue = {
      identifier: venueIdentifier,
      country,
      province,

    };

    const json = parse(setlistData);

    const setlist = {};

    json.forEach((set, setNumber) => {
      if (set.children) {
        set.children.forEach((setElement) => {
          const isSpan = setElement.tagName === 'span';
          if (isSpan) {
            const isSetLabel = setElement.attributes[0].value === 'set-label';

            if (isSetLabel) {
              setlist[setNumber] = [];
              return;
            }
          }

          const isText = setElement.type === 'text';
          if (isText) {
            // These are commas, >'s and ->'s
            return;
          }

          const isAnchor = setElement.tagName === 'a';
          if (isAnchor) {
            const anchor = {};
            setElement.attributes.forEach((attr) => {
              anchor[attr.key] = attr.value;
            });

            const url = anchor.href;
            const toTitleCase = (str) => {
              return str.replace(/\w\S*/g, (txt) => {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
              });
            };

            const song = toTitleCase(url.replace('http://phish.net/song/', '').replace(/-/g, ' '));
            setlist[setNumber].push(song);
          }
        });
      }
    });

    Object.keys(setlist).forEach((key) => {
      const newNumber = Number(key) + 1;
      setlist[`Set ${newNumber}`] = setlist[key];
      delete setlist[key];
    });

    const replaceKeyName = (obj, keyToReplace, newKeyName) => {
      obj[newKeyName] = obj[keyToReplace];
      delete obj[keyToReplace];
    };

    Object.keys(setlist).forEach((key) => {
      const newKey = key.replace('Set ', '');

      return replaceKeyName(setlist, key, newKey);
    });

    const getHighestSetNumber = (obj) => {
      const setNumbers = Object.keys(obj).map((setNumber) => Number(setNumber));

      return setNumbers.sort().reverse()[0];
    };

    replaceKeyName(setlist, getHighestSetNumber(setlist), 'Encore');

    return {
      date: showDate,
      setlist,
      venue,
    };
  })
  .catch((err) => {
    if (err.statusCode >= 400 && err.statusCode < 500) {
      throw new error.UserError('Invalid .net credentials');
    }

    throw err;
  });
};

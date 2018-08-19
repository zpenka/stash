const request = require('request-promise');
const config = require('config');
const parse = require('himalaya').parse;

const apikey = config.phishnet.apikey;
const baseUrl = config.phishnet.baseUrl;

exports.getSetlistForShow = (date) => {
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

    return setlist;
  });
};

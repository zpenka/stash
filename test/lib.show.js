const expect = require('chai').expect;
const P = require('bluebird');

const sinon = require('./helper').sinon;
const db = require('../db');
const show = require('../lib/show');
const phishin = require('../lib/phishin');

describe('lib/show', () => {
  beforeEach(() => {
    sinon.stub(phishin, 'getShow').resolves({
      date: '1997-12-29',
      venue: {
        identifier: 'Madison Square Garden',
        country: 'usa',
        province: 'ny',
      },
      setlist: {
        1: [
          'Nicu',
          'Golgi Apparatus',
          'Crossroads',
          'Cars Trucks Buses',
          'Train Song',
          'Theme From The Bottom',
          'Fluffhead',
          'Dirt',
          'Run Like An Antelope',
        ],
        2: [
          'Down With Disease',
          'David Bowie',
          'Possum',
          'You Enjoy Myself',
        ],
        E: [
          'Good Times Bad Times',
        ],
      },
    });
  });

  describe('.sync', () => {
    it('resolves a status object', () => {
      return show.sync('1997-12-29').then((result) => {
        expect(result).to.deep.equal({
          success: true,
          reason: '',
        });

        expect(phishin.getShow).to.have.callCount(1);
        expect(phishin.getShow.args).to.deep.equal([
          ['1997-12-29'],
        ]);
      });
    });

    it('persists venue data to the database', () => {
      return show.sync('1997-12-29').then(() => {
        const columns = ['identifier', 'country', 'province'];

        return db('venues').select(columns).then((rows) => {
          expect(rows).to.deep.equal([
            {
              identifier: 'Madison Square Garden',
              country: 'usa',
              province: 'ny',
            },
          ]);
        });
      });
    });

    context('when the venue is already in the database', () => {
      beforeEach(() => {
        return db('venues')
        .insert({
          identifier: 'Madison Square Garden',
          country: 'us',
          province: 'ny',
        });
      });

      it('does not write new data to the database', () => {
        return show.sync('1997-12-29').then((result) => {
          expect(result).to.deep.equal({
            success: true,
            reason: '',
          });

          return db('venues').select().then((rows) => {
            expect(rows.length).to.equal(1);
          });
        });
      });
    });

    it('persists the show data to the database', () => {
      return show.sync('1997-12-29').then(() => {
        const columns = ['date', 'year', 'month', 'day'];

        return db('shows').select(columns).then((rows) => {
          expect(rows).to.deep.equal([
            {
              date: '1997-12-29',
              year: 1997,
              month: 12,
              day: 29,
            },
          ]);
        });
      });
    });

    context('when the show is already in the database', () => {
      beforeEach(() => {
        return db('shows')
        .insert({
          date: '1997-12-29',
          year: 1997,
          month: 12,
          day: 29,
          venue_id: 1,
        });
      });

      it('resolves a status object', () => {
        return show.sync('1997-12-29').then((result) => {
          expect(result).to.deep.equal({
            success: true,
            reason: '',
          });
        });
      });

      it('does not write new data to the database', () => {
        return show.sync('1997-12-29').then(() => {
          return db('shows').select().then((rows) => {
            expect(rows.length).to.equal(1);
          });
        });
      });
    });

    it('persists set data to the database', () => {
      return show.sync('1997-12-29').then(() => {
        const columns = ['identifier'];

        return db('sets').select(columns).then((rows) => {
          expect(rows).to.deep.equal([
            {
              identifier: '1',
            },
            {
              identifier: '2',
            },
            {
              identifier: 'E',
            },
          ]);
        });
      });
    });

    context('when a set is already in the database', () => {
      beforeEach(() => {
        return db('sets')
        .insert({
          identifier: '1',
        });
      });

      it('handles it gracefully', () => {
        return show.sync('1997-12-29').then((result) => {
          expect(result).to.deep.equal({
            success: true,
            reason: '',
          });

          return db('sets').select().then((rows) => {
            expect(rows.length).to.equal(3);
          });
        });
      });
    });

    it('persists song data to the database', () => {
      return show.sync('1997-12-29').then(() => {
        const columns = ['identifier'];

        return db('songs').select(columns).then((rows) => {
          expect(rows).to.deep.equal([
            {
              identifier: 'Nicu',
            },
            {
              identifier: 'Golgi Apparatus',
            },
            {
              identifier: 'Crossroads',
            },
            {
              identifier: 'Cars Trucks Buses',
            },
            {
              identifier: 'Train Song',
            },
            {
              identifier: 'Theme From The Bottom',
            },
            {
              identifier: 'Fluffhead',
            },
            {
              identifier: 'Dirt',
            },
            {
              identifier: 'Run Like An Antelope',
            },
            {
              identifier: 'Down With Disease',
            },
            {
              identifier: 'David Bowie',
            },
            {
              identifier: 'Possum',
            },
            {
              identifier: 'You Enjoy Myself',
            },
            {
              identifier: 'Good Times Bad Times',
            },
          ]);
        });
      });
    });

    context('when a song is already in the database', () => {
      beforeEach(() => {
        return db('songs')
        .insert({
          identifier: 'You Enjoy Myself',
        });
      });

      it('handles it gracfully', () => {
        return show.sync('1997-12-29').then((result) => {
          expect(result).to.deep.equal({
            success: true,
            reason: '',
          });

          return db('songs').select().then((rows) => {
            expect(rows.length).to.equal(14);
          });
        });
      });
    });

    it('persists song performances to the database', () => {
      return show.sync('1997-12-29').then(() => {
        const sql = `
          SELECT
            st.identifier           AS set
            , sp.song_number_in_set AS song_number
            , sh.date               AS show_date
            , ss.identifier         AS song
          FROM song_performances sp
          JOIN songs             ss ON ss.id = sp.song_id
          JOIN sets              st ON st.id = sp.set_id
          JOIN shows             sh ON sh.id = sp.show_id
        `;

        return db.raw(sql).then((results) => {
          const rows = results.rows;

          expect(rows).to.deep.equal([
            {
              song: 'Nicu',
              set: '1',
              song_number: 1,
              show_date: '1997-12-29',
            },
            {
              song: 'Golgi Apparatus',
              set: '1',
              song_number: 2,
              show_date: '1997-12-29',
            },
            {
              song: 'Crossroads',
              set: '1',
              song_number: 3,
              show_date: '1997-12-29',
            },
            {
              song: 'Cars Trucks Buses',
              set: '1',
              song_number: 4,
              show_date: '1997-12-29',
            },
            {
              song: 'Train Song',
              set: '1',
              song_number: 5,
              show_date: '1997-12-29',
            },
            {
              song: 'Theme From The Bottom',
              set: '1',
              song_number: 6,
              show_date: '1997-12-29',
            },
            {
              song: 'Fluffhead',
              set: '1',
              song_number: 7,
              show_date: '1997-12-29',
            },
            {
              song: 'Dirt',
              set: '1',
              song_number: 8,
              show_date: '1997-12-29',
            },
            {
              song: 'Run Like An Antelope',
              set: '1',
              song_number: 9,
              show_date: '1997-12-29',
            },
            {
              song: 'Down With Disease',
              set: '2',
              song_number: 1,
              show_date: '1997-12-29',
            },
            {
              song: 'David Bowie',
              set: '2',
              song_number: 2,
              show_date: '1997-12-29',
            },
            {
              song: 'Possum',
              set: '2',
              song_number: 3,
              show_date: '1997-12-29',
            },
            {
              song: 'You Enjoy Myself',
              set: '2',
              song_number: 4,
              show_date: '1997-12-29',
            },
            {
              song: 'Good Times Bad Times',
              set: 'E',
              song_number: 1,
              show_date: '1997-12-29',
            },
          ]);
        });
      });
    });

    context('when a song performance is already in the database', () => {
      beforeEach(() => {
        const getSongId = () => {
          const song = {
            identifier: 'David Bowie',
          };

          return db('songs').insert(song).then(() => {
            return db('songs').select().then((result) => {
              return result[0].id;
            });
          });
        };

        const getSetId = () => {
          const set = {
            identifier: '2',
          };

          return db('sets').insert(set).then(() => {
            return db('sets').select().then((result) => {
              return result[0].id;
            });
          });
        };

        const getShowId = () => {
          const getVenueId = () => {
            const venue = {
              identifier: 'Madison Square Garden',
              country: 'us',
              province: 'ny',
            };

            return db('venues').insert(venue).then(() => {
              return db('venues').select().then((result) => {
                return result[0].id;
              });
            });
          };

          return getVenueId().then((venueId) => {
            const show = {
              date: '1997-12-29',
              year: 1997,
              month: 12,
              day: 29,
              venue_id: venueId,
            };

            return db('shows').insert(show).then(() => {
              return db('shows').select().then((result) => {
                return result[0].id;
              });
            });
          });
        };

        return P.all([
          getSongId(),
          getSetId(),
          getShowId(),
        ]).spread((songId, setId, showId) => {
          return db('song_performances').insert({
            song_id: songId,
            set_id: setId,
            show_id: showId,
            song_number_in_set: 2,
          });
        });
      });

      it('handles it gracefully', () => {
        return show.sync('1997-12-29').then((result) => {
          expect(result).to.deep.equal({
            success: true,
            reason: '',
          });

          return db('song_performances').select().then((rows) => {
            expect(rows.length).to.equal(14);
          });
        });
      });
    });

    context('when .phishin is unavailable', () => {
      beforeEach(() => {
        phishin.getShow.rejects(new Error('fake-phishin-error'));
      });

      it('resolves a status object with details', () => {
        return show.sync('1997-12-29').then((result) => {
          expect(result).to.deep.equal({
            success: false,
            reason: 'fake-phishin-error',
          });
        });
      });
    });
  });
});

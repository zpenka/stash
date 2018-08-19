const expect = require('chai').expect;

const sinon = require('./helper').sinon;
const db = require('../db');
const show = require('../lib/show');
const net = require('../lib/net');

describe('lib/show', () => {
  beforeEach(() => {
    sinon.stub(net, 'getShow').resolves({
      date: '1997-12-29',
      venue: {
        identifier: 'Madison Square Garden',
        country: 'us',
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
        Encore: [
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

        expect(net.getShow).to.have.callCount(1);
        expect(net.getShow.args).to.deep.equal([
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
              country: 'us',
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
              identifier: 'Encore',
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

    context('when .net is unavailable', () => {
      beforeEach(() => {
        net.getShow.rejects(new Error('fake-net-error'));
      });

      it('resolves a status object with details', () => {
        return show.sync('1997-12-29').then((result) => {
          expect(result).to.deep.equal({
            success: false,
            reason: 'fake-net-error',
          });
        });
      });
    });
  });
});

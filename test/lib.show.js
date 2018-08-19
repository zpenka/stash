const expect = require('chai').expect;

const sinon = require('./helper').sinon;

const db = require('../db');

const show = require('../lib/show');
const net = require('../lib/net');

describe('lib/show', () => {
  beforeEach(() => {
    sinon.stub(net, 'getShow').resolves({
      date: '1997-12-29',
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

    it('persists the show data to the database', () => {
      return show.sync('1997-12-29').then(() => {
        const columns = ['date', 'year', 'month', 'day'];

        return db.select(columns).from('shows').then((rows) => {
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
        return db
        .insert({
          date: '1997-12-29',
          year: 1997,
          month: 12,
          day: 29,
        })
        .into('shows');
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
          return db.select().from('shows').then((rows) => {
            expect(rows.length).to.equal(1);
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

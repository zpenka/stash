const expect = require('chai').expect;
const request = require('request-promise');
const nock = require('nock');
const sinon = require('./helper').sinon;
const config = require('config');

const phishin = require('../lib/phishin');

describe('lib/phishin', () => {
  let baseUrl;

  beforeEach(() => {
    baseUrl = config.phishin.baseUrl;
  });

  describe('.getShowIdsForYear', () => {
    beforeEach(() => {
      sinon.spy(request, 'get');
    });

    it('retrieves the show dates and returns an array of show ids for a year', () => {
      const mockResponse = {
        success: true,
        total_entries: 1,
        total_pages: 1,
        page: 1,
        data: [
          { id: 1 },
          { id: 2 },
          { id: 3 },
          { id: 4 },
        ],
      };

      nock(baseUrl).get('/years/2018').reply(200, mockResponse);

      return phishin.getShowIdsForYear('2018').then((showIds) => {
        expect(request.get).to.have.callCount(1);
        expect(request.get.args).to.deep.equal([
          [
            {
              json: true,
              uri: `${baseUrl}/years/2018`,
            },
          ]
        ]);

        expect(showIds).to.deep.equal([1, 2, 3, 4]);
      });
    });
  });

  describe('.getShow', () => {
    beforeEach(() => {
      sinon.spy(request, 'get');
    });

    it('retrieves the show data and returns the setlist', () => {
      const response = {
        success: true,
        total_entries: 1,
        total_pages: 1,
        page: 1,
        data: {
          id: 1727,
          date: '1997-12-29',
          tour_id: 32,
          venue: {
            id: 408,
            slug: 'madison-square-garden',
            name: 'Madison Square Garden',
            past_names: null,
            location: 'New York, NY',
            updated_at: '2014-01-26 07:25:53 UTC'
          },
          tracks: [
            {
              id: 28368,
              show_id: 1727,
              show_date: '1997-12-29',
              title: 'NICU',
              position: 1,
              duration: 368144,
              set: '1',
              set_name: 'Set 1',
              likes_count: 1,
              slug: 'nicu',
              tags: [],
              mp3: 'https://phish.in/audio/000/028/368/28368.mp3',
              song_ids: [
                547
              ],
              updated_at: '2014-04-18 07:52:28 UTC'
            },
            {
              id: 28369,
              show_id: 1727,
              show_date: '1997-12-29',
              title: 'Golgi Apparatus',
              position: 2,
              duration: 281757,
              set: '1',
              set_name: 'Set 1',
              likes_count: 2,
              slug: 'golgi-apparatus',
              tags: [],
              mp3: 'https://phish.in/audio/000/028/369/28369.mp3',
              song_ids: [
                304
              ],
              updated_at: '2014-04-18 07:52:28 UTC'
            },
            {
              id: 28370,
              show_id: 1727,
              show_date: '1997-12-29',
              title: 'Crossroads',
              position: 3,
              duration: 307200,
              set: '1',
              set_name: 'Set 1',
              likes_count: 5,
              slug: 'crossroads',
              tags: [],
              mp3: 'https://phish.in/audio/000/028/370/28370.mp3',
              song_ids: [
                179
              ],
              updated_at: '2014-04-18 07:52:29 UTC'
            },
            {
              id: 28371,
              show_id: 1727,
              show_date: '1997-12-29',
              title: 'Cars Trucks Buses',
              position: 4,
              duration: 332617,
              set: '1',
              set_name: 'Set 1',
              likes_count: 3,
              slug: 'cars-trucks-buses',
              tags: [],
              mp3: 'https://phish.in/audio/000/028/371/28371.mp3',
              song_ids: [
                138
              ],
              updated_at: '2014-04-18 07:52:29 UTC'
            },
            {
              id: 28372,
              show_id: 1727,
              show_date: '1997-12-29',
              title: 'Train Song',
              position: 5,
              duration: 181656,
              set: '1',
              set_name: 'Set 1',
              likes_count: 0,
              slug: 'train-song',
              tags: [],
              mp3: 'https://phish.in/audio/000/028/372/28372.mp3',
              song_ids: [
                790
              ],
              updated_at: '2014-04-18 07:52:29 UTC'
            },
            {
              id: 28373,
              show_id: 1727,
              show_date: '1997-12-29',
              title: 'Theme From the Bottom',
              position: 6,
              duration: 748878,
              set: '1',
              set_name: 'Set 1',
              likes_count: 11,
              slug: 'theme-from-the-bottom',
              tags: [
                'Jamcharts'
              ],
              mp3: 'https://phish.in/audio/000/028/373/28373.mp3',
              song_ids: [
                770
              ],
              updated_at: '2014-04-18 07:52:29 UTC'
            },
            {
              id: 28374,
              show_id: 1727,
              show_date: '1997-12-29',
              title: 'Fluffhead',
              position: 7,
              duration: 992679,
              set: '1',
              set_name: 'Set 1',
              likes_count: 5,
              slug: 'fluffhead',
              tags: [],
              mp3: 'https://phish.in/audio/000/028/374/28374.mp3',
              song_ids: [
                264
              ],
              updated_at: '2014-04-18 07:52:30 UTC'
            },
            {
              id: 28375,
              show_id: 1727,
              show_date: '1997-12-29',
              title: 'Dirt',
              position: 8,
              duration: 246544,
              set: '1',
              set_name: 'Set 1',
              likes_count: 1,
              slug: 'dirt',
              tags: [],
              mp3: 'https://phish.in/audio/000/028/375/28375.mp3',
              song_ids: [
                203
              ],
              updated_at: '2014-04-18 07:52:30 UTC'
            },
            {
              id: 28376,
              show_id: 1727,
              show_date: '1997-12-29',
              title: 'Run Like an Antelope',
              position: 9,
              duration: 958981,
              set: '1',
              set_name: 'Set 1',
              likes_count: 15,
              slug: 'run-like-an-antelope',
              tags: [
                'Jamcharts'
              ],
              mp3: 'https://phish.in/audio/000/028/376/28376.mp3',
              song_ids: [
                651
              ],
              updated_at: '2014-04-18 07:52:30 UTC'
            },
            {
              id: 28377,
              show_id: 1727,
              show_date: '1997-12-29',
              title: 'Down with Disease',
              position: 10,
              duration: 1399380,
              set: '2',
              set_name: 'Set 2',
              likes_count: 18,
              slug: 'down-with-disease',
              tags: [
                'Jamcharts'
              ],
              mp3: 'https://phish.in/audio/000/028/377/28377.mp3',
              song_ids: [
                225
              ],
              updated_at: '2014-04-18 07:52:31 UTC'
            },
            {
              id: 28378,
              show_id: 1727,
              show_date: '1997-12-29',
              title: 'David Bowie',
              position: 11,
              duration: 1188101,
              set: '2',
              set_name: 'Set 2',
              likes_count: 9,
              slug: 'david-bowie',
              tags: [
                'Jamcharts'
              ],
              mp3: 'https://phish.in/audio/000/028/378/28378.mp3',
              song_ids: [
                979
              ],
              updated_at: '2014-04-18 07:52:34 UTC'
            },
            {
              id: 28379,
              show_id: 1727,
              show_date: '1997-12-29',
              title: 'Possum',
              position: 12,
              duration: 631249,
              set: '2',
              set_name: 'Set 2',
              likes_count: 9,
              slug: 'possum',
              tags: [
                'Jamcharts'
              ],
              mp3: 'https://phish.in/audio/000/028/379/28379.mp3',
              song_ids: [
                595
              ],
              updated_at: '2014-04-18 07:52:35 UTC'
            },
            {
              id: 28380,
              show_id: 1727,
              show_date: '1997-12-29',
              title: 'Tube',
              position: 13,
              duration: 655517,
              set: '2',
              set_name: 'Set 2',
              likes_count: 33,
              slug: 'tube',
              tags: [
                'Jamcharts'
              ],
              mp3: 'https://phish.in/audio/000/028/380/28380.mp3',
              song_ids: [
                797
              ],
              updated_at: '2014-04-18 07:52:35 UTC'
            },
            {
              id: 28381,
              show_id: 1727,
              show_date: '1997-12-29',
              title: 'You Enjoy Myself',
              position: 14,
              duration: 1106991,
              set: '2',
              set_name: 'Set 2',
              likes_count: 9,
              slug: 'you-enjoy-myself',
              tags: [],
              mp3: 'https://phish.in/audio/000/028/381/28381.mp3',
              song_ids: [
                879
              ],
              updated_at: '2014-04-18 07:52:36 UTC'
            },
            {
              id: 28382,
              show_id: 1727,
              show_date: '1997-12-29',
              title: 'Good Times Bad Times',
              position: 15,
              duration: 426789,
              set: 'E',
              set_name: 'Encore',
              likes_count: 1,
              slug: 'good-times-bad-times',
              tags: [],
              mp3: 'https://phish.in/audio/000/028/382/28382.mp3',
              song_ids: [
                306
              ],
              updated_at: '2014-04-18 07:52:37 UTC'
            }
          ],
          updated_at: '2014-08-02 06:46:16 UTC'
        }
      };

      nock(baseUrl).get('/shows/123').reply(200, response);

      return phishin.getShow(123).then((show) => {
        expect(request.get).to.have.callCount(1);
        expect(request.get.args).to.deep.equal([
          [
            {
              json: true,
              uri: 'http://phish.testing.in/api/v1/shows/123',
            },
          ]
        ]);

        expect(show).to.deep.equal({
          date: '1997-12-29',
          venue: {
            identifier: 'Madison Square Garden',
            country: 'usa',
            location: 'New York, NY',
          },
          setlist: {
            1: [
              'NICU',
              'Golgi Apparatus',
              'Crossroads',
              'Cars Trucks Buses',
              'Train Song',
              'Theme From the Bottom',
              'Fluffhead',
              'Dirt',
              'Run Like an Antelope',
            ],
            2: [
              'Down with Disease',
              'David Bowie',
              'Possum',
              'Tube',
              'You Enjoy Myself',
            ],
            E: [
              'Good Times Bad Times',
            ],
          },
        });
      });
    });

    context('when phish.in is down', () => {
      it('bubbles up an error', (done) => {
        nock(baseUrl)
          .get('/shows/123')
          .reply(500, 'Internal Server Error');

        phishin.getShow(123).asCallback((err) => {
          expect(err).to.exist;

          expect(err.statusCode).to.equal(500);

          return done();
        });
      });
    });
  });
});

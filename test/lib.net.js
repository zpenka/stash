const expect = require('chai').expect;
const request = require('request-promise');
const nock = require('nock');
const sinon = require('./helper').sinon;
const config = require('config');

const net = require('../lib/net');

const apikey = config.phishnet.apikey;
const baseUrl = config.phishnet.baseUrl;

describe('lib/net', () => {
  describe('.getSetlistForShow', () => {
    beforeEach(() => {
      sinon.spy(request, 'get');
    });

    it('retrieves the show data and returns the setlist', () => {
      const response = {
        error_code: 0,
        error_message: null,
        response: {
          count: 1,
          data: [
            {
              artist: "<a href='http://phish.net/setlists/phish'>Phish</a>",
              artistid: 1,
              gapchart: 'http://phish.net/setlists/gap-chart/phish-december-29-1997-madison-square-garden-new-york-ny-usa.html',
              location: 'New York, NY, USA',
              long_date: 'Monday 12/29/1997',
              rating: '4.6786',
              relative_date: '19 years ago',
              // eslint-disable-next-line
              setlistdata: "<p><span class='set-label'>Set 1</span>: <a href='http://phish.net/song/nicu' class='setlist-song' title='NICU'>NICU</a> > <a href='http://phish.net/song/golgi-apparatus' class='setlist-song' title='Golgi Apparatus'>Golgi Apparatus</a> > <a href='http://phish.net/song/crossroads' class='setlist-song' title='Crossroads'>Crossroads</a>, <a href='http://phish.net/song/cars-trucks-buses' class='setlist-song' title='Cars Trucks Buses'>Cars Trucks Buses</a>, <a href='http://phish.net/song/train-song' class='setlist-song' title='Train Song'>Train Song</a>, <a title=\"Blistering, high octane version with nice concluding transition space and a &gt; to &quot;Fluffhead.&quot;\" href='http://phish.net/song/theme-from-the-bottom' class='setlist-song' title='Blistering, high octane version with nice concluding transition space and a &gt; to &quot;Fluffhead.&quot;'>Theme From the Bottom</a> > <a href='http://phish.net/song/fluffhead' class='setlist-song' title='Fluffhead'>Fluffhead</a>, <a href='http://phish.net/song/dirt' class='setlist-song' title='Dirt'>Dirt</a>, <a title=\"Straightforward but well played jam, followed by some downright filthy funk jamming in the &quot;Rocco&quot; section.\" href='http://phish.net/song/run-like-an-antelope' class='setlist-song' title='Straightforward but well played jam, followed by some downright filthy funk jamming in the &quot;Rocco&quot; section.'>Run Like an Antelope</a></p><p><span class='set-label'>Encore 2</span>:<a title=\"Fearsome but exploratory jam. Moments of quiet settle are repeatedly upended by intense funk rocking. This legitimate monster &quot;Disease&quot; finally gives up a little belligerence only to -> into a very strong &quot;David Bowie.&quot;\" href='http://phish.net/song/down-with-disease' class='setlist-song' title='Fearsome but exploratory jam. Moments of quiet settle are repeatedly upended by intense funk rocking. This legitimate monster &quot;Disease&quot; finally gives up a little belligerence only to -> into a very strong &quot;David Bowie.&quot;'>Down with Disease</a><sup title=\"Unfinished.\">[\"2]</sup> -> <a title=\"Excellent and thrilling version with strong musicianship. Mode shift out of typical (but very well played) &quot;Bowie&quot; at 13:55 into a great groove which peaks and returns to &quot;Bowie&quot; by 17:00.\" href='http://phish.net/song/david-bowie' class='setlist-song' title='Excellent and thrilling version with strong musicianship. Mode shift out of typical (but very well played) &quot;Bowie&quot; at 13:55 into a great groove which peaks and returns to &quot;Bowie&quot; by 17:00.'>David Bowie</a><sup title=\"Antelope-esque jamming. James Bond Theme tease from Mike.\">[\"3]</sup> > <a title=\"> in from a strong &quot;Bowie.&quot; There are two &quot;I Can't Turn You Loose&quot; (Blues Brothers) jams in this solid &quot;Possum.&quot;\" href='http://phish.net/song/possum' class='setlist-song' title='> in from a strong &quot;Bowie.&quot; There are two &quot;I Can't Turn You Loose&quot; (Blues Brothers) jams in this solid &quot;Possum.&quot;'>Possum</a>, <a title=\"Simply the slowest, funkiest, and thickest &quot;Tube&quot; ever played, featuring a  seamless full-band groove and breakdown solos by Trey, Page, and Mike.  This jam is a great example of the band playing as one and is among the best versions ever.  &quot;I Feel the Earth Move&quot; tease.\" href='http://phish.net/song/tube' class='setlist-song' title='Simply the slowest, funkiest, and thickest &quot;Tube&quot; ever played, featuring a  seamless full-band groove and breakdown solos by Trey, Page, and Mike.  This jam is a great example of the band playing as one and is among the best versions ever.  &quot;I Feel the Earth Move&quot; tease.'>Tube</a>, <a href='http://phish.net/song/you-enjoy-myself' class='setlist-song' title='You Enjoy Myself'>You Enjoy Myself</a></p><p><span class='set-label'>Encore</span>:<a href='http://phish.net/song/good-times-bad-times' class='setlist-song' title='Good Times Bad Times'>Good Times Bad Times</a><p class='setlist-footer'>[2] Unfinished.<br>[3] Antelope-esque jamming. James Bond Theme tease from Mike.<br></p>",
              // eslint-disable-next-line
              setlistnotes: "Disease was unfinished.&nbsp;Bowie included Antelope-esque jamming and a tease from Mike of the Theme from James Bond.&nbsp;Possum contained a Can&rsquo;t Turn You Loose jam, which was briefly reprised after the song and teased by Page in YEM.&nbsp;Tube featured an I Feel the Earth Move tease. The soundcheck&#39;s Funky Bitch featured Trey on vocals.&nbsp;This show is available as an archival release on LivePhish.com.<br>via <a href=\"http://phish.net\">phish.net</a>",
              short_date: '12/29/1997',
              showdate: '1997-12-29',
              showid: 1252698446,
              url: 'http://phish.net/setlists/phish-december-29-1997-madison-square-garden-new-york-ny-usa.html',
              venue: '<a href="http://phish.net/venue/157/Madison_Square_Garden">MSG</a>',
              venueid: 157
            }
          ]
        }
      };

      nock(baseUrl)
        .get('/setlists/get')
        .query({
          apikey,
          showdate: '1997-12-29',
        })
        .reply(200, response);

      return net.getSetlistForShow('1997-12-29').then((setlist) => {
        expect(request.get).to.have.callCount(1);
        expect(request.get.args).to.deep.equal([
          [
            {
              json: true,
              uri: 'https://api.phish.testing.net/v3/setlists/get',
              qs: {
                apikey: 'fake-apikey',
                showdate: '1997-12-29',
              },
            },
          ]
        ]);

        expect(setlist).to.deep.equal({
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
        });
      });
    });
  });
});

const expect = require('chai').expect;
const app = require('../index');
const request = require('supertest');

describe('index', () => {
  it('returns a server instance that boots up without problems', () => {
    return request(app)
      .get('/')
      .expect(200)
      .then((res) => {
        expect(res.body).to.deep.equal({
          message: 'not implemented',
        });
      });
  });
});

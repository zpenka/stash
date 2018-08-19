const chai = require('chai');
const sinon = require('sinon');

const db = require('../db');
const knexCleaner = require('knex-cleaner');

chai.use(require('sinon-chai'));

exports.sinon = sinon.sandbox.create();

beforeEach(() => {
  // Setup sinon sandbox for spies and stubs
  if (exports.sinon) {
    exports.sinon.restore();
  } else {
    exports.sinon = sinon.sandbox.create();
  }

  // Clear db rows in between each test
  return knexCleaner.clean(db);
});

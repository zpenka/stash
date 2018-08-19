const chai = require('chai');
const sinon = require('sinon');

chai.use(require('sinon-chai'));

exports.sinon = sinon.sandbox.create();

beforeEach(() => {
  // Setup sinon sandbox for spies and stubs
  if (exports.sinon) {
    exports.sinon.restore();
  } else {
    exports.sinon = sinon.sandbox.create();
  }
});

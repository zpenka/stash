// Dependencies
const winston = require('winston');
const _ = require('lodash');

// Define logger configuration
let logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      json: false,
      colorize: true,
      timestamp: true
    })
  ],
  exitOnError: false
});

// Suppress logging when running tests
if (process.env.NODE_ENV === 'test') {
  logger = {
    info: _.noop,
    error: _.noop
  };
}

module.exports = logger;

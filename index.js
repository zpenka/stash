const express = require('express');
const log = require('./lib/log');
const error = require('./lib/error');

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set('port', (process.env.PORT || 1337));

app.get('/', (req, res) => {
  return res.json({
    message: 'not implemented',
  });
});

// Generic error handling
app.use((err, req, res, next) => {
  if (err instanceof error.UserError) {
    return res.status(err.statusCode).json(err.toJSON());
  }

  if (!err) {
    return next();
  }

  // The following will be called on unexpected errors
  const stack = err ? err.stack : undefined;
  const message = err ? err.message : undefined;
  const currentStack = new Error().stack;

  log.error({ err, stack, currentStack });

  return res.status(500).json({
    error: message,
  });
});

// Server
app.listen(app.get('port'), () => {
  log.info(`Server listening on port ${app.get('port')}`);
});

log.info(`[application] Started in environment ${(process.env.NODE_ENV || 'local').toUpperCase()}`);

// Expose app for testing
module.exports = app;

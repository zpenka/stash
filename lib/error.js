const util = require('util');

const UserError = function UserError(message, statusCode) {
  Error.call(this);

  this.message = message;
  this.statusCode = statusCode || 400;
  this.errors = [];
};

util.inherits(UserError, Error);

UserError.prototype.toJSON = function toJSON() {
  const result = {
    message: this.message,
  };

  if (this.errors && this.errors.length) {
    result.errors = this.errors;
  }

  return result;
};

module.exports = {
  UserError,
};

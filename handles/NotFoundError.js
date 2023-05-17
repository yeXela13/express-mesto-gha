const http2 = require('http2').constants;

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotFoundError';
    this.statusCode = http2.HTTP_STATUS_NOT_FOUND;
  }
}

module.exports = NotFoundError;

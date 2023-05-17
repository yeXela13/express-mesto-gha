const http2 = require('http2').constants;

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ForbiddenError';
    this.statusCode = http2.HTTP_STATUS_FORBIDDEN;
  }
}

module.exports = ForbiddenError;

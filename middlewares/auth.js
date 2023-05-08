const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../handles/UnauthorizedError');

module.exports = (req, res, next) => {
  // const { authorization } = req.headers;
  const token = req.cookies.jwt;
  // if (!authorization || !authorization.startsWith('Bearer ')) {
  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  // const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};

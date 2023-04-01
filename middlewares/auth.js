const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const AuthorizedError = require('../errors/AuthorizedError');

function extractBearerToken(header) {
  return header.replace('Bearer ', '');
}

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthorizedError('Необходима авторизация'));
  }
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new AuthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  next();
};

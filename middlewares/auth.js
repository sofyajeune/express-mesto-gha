const jwt = require('jsonwebtoken');
const { JWT_SECRET, NODE_ENV } = require('../config');
const AuthorizedError = require('../errors/AuthorizedError');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new AuthorizedError('Необходима авторизация'));
  }
  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev');
  } catch (err) {
    return next(new AuthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};

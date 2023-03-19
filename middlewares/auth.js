const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../app');
const { UNAUTHORIZED } = require('../utils/resMessage'); // Ответы

function extractBearerToken(header) {
  return header.replace('Bearer ', '');
}

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next({ statusCode: 401, message: UNAUTHORIZED.RESPONSE });
  }
  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next({ statusCode: 401, message: UNAUTHORIZED.RESPONSE });
  }

  req.user = payload;

  next();
};

const jwt = require('jsonwebtoken');
const NotAuthorised = require('../errors/NotAuthorised');

const { JWT_SECRET = 'secret-key' } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthorised('Необходима авторизация');
  }
  let payload;
  try {
    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new NotAuthorised('Необходима авторизация'));
  }
  req.user = payload;
  next();
};

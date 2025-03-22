const { NODE_ENV, SECRET } = require('./config.js');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const logger = require('./logger');

module.exports = {
  validateAuthorization: (req, res, next) => {
    const authorization = req.get('Authorization');
    if (authorization && /^Bearer .+/i.test(authorization)) {
      const token = authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, SECRET);
      if (decodedToken && decodedToken.id) {
        req.user = decodedToken;
      }
    }
    if (!req.user) res.status(401).json({ error: 'invalid token' });
    else next();
  },

  requestLogger: (req, res, next) => {
    if (NODE_ENV !== 'test') {
      logger.info(`${req.method} ${req.path}`);
      const strBody = JSON.stringify(req.body, null, 2);
      if (strBody !== '{}') logger.info(`Body: ${strBody}`);
    }
    next();
  },

  unknownEndpoint: (req, res) => {
    if (NODE_ENV !== 'test') logger.info(`"${req.path}" is unknown route!`);
    res.status(404).send({ error: 'unknown endpoint' });
  },

  errorHandler: (err, req, res, next) => {
    if (NODE_ENV !== 'test') logger.error(err?.toString() || err);
    const { CastError, ValidationError } = mongoose.Error;
    const { JsonWebTokenError, TokenExpiredError } = jwt;
    const { MongoServerError } = mongoose.mongo;
    if (err instanceof CastError) {
      res.status(400).json({ error: 'malformed id' });
    } else if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
    } else if (err instanceof MongoServerError && err.code === 11000) {
      res.status(400).json({ error: 'username already exist' });
    } else if (err instanceof JsonWebTokenError) {
      return res.status(401).json({ error: 'invalid token' });
    } else if (err instanceof TokenExpiredError) {
      return res.status(401).json({ error: 'token expired' });
    } else {
      next(err);
    }
  },
};

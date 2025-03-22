const { NODE_ENV } = require('./config.js');
const mongoose = require('mongoose');
const logger = require('./logger');

module.exports = {
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
    const { CastError } = mongoose.Error;
    if (err instanceof CastError) {
      res.status(400).json({ error: 'malformed id' });
    } else {
      next(err);
    }
  },
};

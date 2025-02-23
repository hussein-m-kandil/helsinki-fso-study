const mongoose = require('mongoose');
const logger = require('./logger');

module.exports = {
  requestLogger: (req, res, next) => {
    logger.info(`${req.method} ${req.path}, Body:`, req.body);
    next();
  },

  unknownEndpoint: (req, res) => {
    res.status(404).send({ error: 'unknown endpoint' });
  },

  errorHandler: (err, req, res, next) => {
    logger.error(err.message);
    const { CastError, ValidationError } = mongoose.Error;
    const error =
      err instanceof CastError
        ? 'malformed id'
        : err instanceof ValidationError
          ? err.message
          : null;
    if (error) res.status(400).json({ error });
    else next(err);
  },
};

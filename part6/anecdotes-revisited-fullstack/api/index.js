const { PORT, MONGODB_URI, SERVERLESS_FUNCTION } = require('./utils/config.js');
require('express-async-errors'); // Must required before the routes!
const middleware = require('./utils/middleware.js');
const logger = require('./utils/logger.js');
const mongoose = require('mongoose');
const express = require('express');
const path = require('node:path');
const anecdotesRouter = require('./controllers/anecdotes.js');
const app = express();

const hideUriCredentials = (uri) => {
  if (typeof uri !== 'string') return uri;
  return uri
    .replace(/(?<=.+:\/\/).+(?=:)/, '<user>')
    .replace(/(?<=.+:\/\/.+:).+(?=@)/, '<password>');
};

logger.info(`Connecting to MongoDB on: ${hideUriCredentials(MONGODB_URI)}`);
mongoose
  .connect(MONGODB_URI, { timeoutMS: 57 * 1000 })
  .then(() => logger.info('MongoDB connection established'))
  .catch(logger.error);

app.use(express.json());
app.use(middleware.requestLogger);
app.use(express.static(path.join(__dirname, '../frontend/dist/')));
app.use('/api/anecdotes', anecdotesRouter);
app.use(
  '/anecdotes-rtk',
  express.static(
    path.join(__dirname, '../frontend/anecdotes-revisited-rtk/dist/'),
  ),
);
app.use(
  '/anecdotes-rq',
  express.static(
    path.join(__dirname, '../frontend/anecdotes-revisited-rq/dist/'),
  ),
);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

if (!SERVERLESS_FUNCTION) {
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
} else {
  module.exports = app;
}

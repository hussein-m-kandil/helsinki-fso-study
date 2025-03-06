require('express-async-errors'); // Must required before the routes!
const { MONGODB_URI, NODE_ENV } = require('./utils/config.js');
const loginRouter = require('./controllers/login.js');
const blogRouter = require('./controllers/blog.js');
const userRouter = require('./controllers/user.js');
const middleware = require('./utils/middleware.js');
const logger = require('./utils/logger.js');
const mongoose = require('mongoose');
const express = require('express');
const path = require('node:path');
const app = express();

const hideUriCredentials = (uri) => {
  if (typeof uri !== 'string') return uri;
  return uri
    .replace(/(?<=.+:\/\/).+(?=:)/, '<user>')
    .replace(/(?<=.+:\/\/.+:).+(?=@)/, '<password>');
};

const FRONT_BUILD_DIR = path.join(__dirname, '../dist');

logger.info(`Connecting to MongoDB on: ${hideUriCredentials(MONGODB_URI)}`);
mongoose
  .connect(MONGODB_URI, { timeoutMS: 57 * 1000 })
  .then(() => logger.info('MongoDB connection established'))
  .catch(logger.error);

app.use(express.json());
app.use(middleware.requestLogger);

app.use(express.static(FRONT_BUILD_DIR));

app.use('/api/login', loginRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);

if (NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

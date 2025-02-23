require('express-async-errors'); // Must required before the routes!
const { MONGODB_URI } = require('./utils/config.js');
const loginRouter = require('./controllers/login.js');
const blogRouter = require('./controllers/blog.js');
const userRouter = require('./controllers/user.js');
const middleware = require('./utils/middleware.js');
const logger = require('./utils/logger.js');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

logger.info(`Connecting to MongoDB on: ${MONGODB_URI}`);
mongoose
  .connect(MONGODB_URI, { timeoutMS: 57 * 1000 })
  .then(() => logger.info('MongoDB connection established'))
  .catch(logger.error);

app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/login', loginRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;

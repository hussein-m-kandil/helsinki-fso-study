require('express-async-errors'); // Must required before the routes!
const {
  MONGODB_URI,
  NODE_ENV,
  PORT,
  SERVERLESS_FUNCTION,
} = require('./utils/config.js');
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

logger.info(`Connecting to MongoDB on: ${hideUriCredentials(MONGODB_URI)}`);
mongoose.set('bufferTimeoutMS', 57 * 1000);
mongoose
  .connect(MONGODB_URI)
  .then(() => logger.info('MongoDB connection established'))
  .catch(logger.error);

app.use(express.json());
app.use(middleware.requestLogger);

app.use('/api/login', loginRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/users', userRouter);

app.use(
  '/bloglist-rr',
  express.static(path.join(__dirname, '../dist/react-redux')),
);
app.use(
  '/bloglist-rq',
  express.static(path.join(__dirname, '../dist/react-query')),
);
app.use('/', express.static(path.join(__dirname, '../dist/index')));

app.get('/bloglist-rr/*', (req, res) => res.redirect('/bloglist-rr'));
app.get('/bloglist-rq/*', (req, res) => res.redirect('/bloglist-rq'));

if (NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

if (!SERVERLESS_FUNCTION) {
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
} else {
  module.exports = app;
}

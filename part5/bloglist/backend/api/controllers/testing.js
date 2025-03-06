const testingRouter = require('express').Router();
const logger = require('../utils/logger.js');
const User = require('../models/user.js');
const Blog = require('../models/blog.js');

testingRouter.post('/reset', async (req, res) => {
  logger.info('Resetting the database state...');
  await Blog.deleteMany({});
  await User.deleteMany({});
  res.status(204).end();
});

module.exports = testingRouter;

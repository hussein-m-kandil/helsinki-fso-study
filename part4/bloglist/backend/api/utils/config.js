const NODE_ENV = process.env.NODE_ENV;
module.exports = {
  NODE_ENV,
  MONGODB_URI:
    NODE_ENV === 'test'
      ? process.env.TEST_MONGODB_URI
      : process.env.MONGODB_URI,
  PORT: process.env.PORT || 3003,
  SECRET: process.env.SECRET,
};

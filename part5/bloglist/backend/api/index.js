const { PORT, SERVERLESS_FUNCTION } = require('./utils/config.js');
const logger = require('./utils/logger.js');
const app = require('./app.js');

if (!SERVERLESS_FUNCTION) {
  app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
} else {
  module.exports = app;
}

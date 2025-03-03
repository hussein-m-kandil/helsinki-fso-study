const { PORT } = require('./api/utils/config.js');
const logger = require('./api/utils/logger.js');
const app = require('./api/app.js');

app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

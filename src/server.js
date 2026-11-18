const app = require('./app');
const logger = require('./utils/logger');

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  logger.info(`Banking API running on http://localhost:${PORT}`);
});

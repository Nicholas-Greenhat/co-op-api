const express = require('express');
const bankingRoutes = require('./routes/banking.routes');
const { error } = require('./utils/response');
const logger = require('./utils/logger');

const app = express();

app.use(express.json());

app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

app.use('/api', bankingRoutes);

// 404 handler
app.use((_req, res) => error(res, 'Route not found', 404));

// Global error handler
app.use((err, _req, res, _next) => {
  logger.error(`Unhandled error: ${err.message}`);
  error(res, 'An unexpected error occurred', 500);
});

module.exports = app;

const timestamp = () => new Date().toISOString().replace('T', ' ').substring(0, 19);

/**
 * Sends a successful JSON response.
 * @param {import('express').Response} res
 * @param {string} message - Human-readable success message
 * @param {object} data - Response payload
 * @param {number} [statusCode=200] - HTTP status code
 */
const success = (res, message, data, statusCode = 200) =>
  res.status(statusCode).json({ success: true, message, data, timestamp: timestamp() });

/**
 * Sends an error JSON response.
 * @param {import('express').Response} res
 * @param {string} message - Human-readable error message
 * @param {number} [statusCode=400] - HTTP status code
 */
const error = (res, message, statusCode = 400) =>
  res.status(statusCode).json({ success: false, message, timestamp: timestamp() });

module.exports = { success, error };

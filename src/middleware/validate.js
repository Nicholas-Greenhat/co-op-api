const { body, validationResult } = require('express-validator');
const { error } = require('../utils/response');

/**
 * Validation rules applied to transaction and transfer request bodies.
 * Ensures senderAccountNumber, receiverAccountNumber, and amount are present and valid.
 */
const transactionRules = [
  body('senderAccountNumber').trim().notEmpty().withMessage('Sender account number is required'),
  body('receiverAccountNumber').trim().notEmpty().withMessage('Receiver account number is required'),
  body('amount').isFloat({ gt: 0 }).withMessage('Amount must be a number greater than zero'),
];

/**
 * Middleware that checks the result of transactionRules.
 * Returns a 400 response with all validation error messages if any rule fails.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(', ');
    return error(res, messages, 400);
  }
  next();
};

module.exports = { transactionRules, validate };

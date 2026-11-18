const bankingService = require('../services/banking.service');
const { success, error } = require('../utils/response');
const logger = require('../utils/logger');

/**
 * POST /api/transactions
 * Saves transaction details to the database with a PENDING status.
 * Does not move any funds.
 */
const saveTransaction = async (req, res) => {
  try {
    const transaction = await bankingService.saveTransaction(req.body);
    return success(res, 'Transaction saved successfully', transaction, 201);
  } catch (err) {
    logger.error(`Save transaction error: ${err.message}`);
    return error(res, err.message, err.status || 500);
  }
};

/**
 * POST /api/transfers
 * Moves funds from the sender's account to the receiver's account
 * and records the transaction as COMPLETED.
 */
const transferFunds = async (req, res) => {
  try {
    const transaction = await bankingService.transferFunds(req.body);
    return success(res, 'Funds transferred successfully', transaction);
  } catch (err) {
    logger.error(`Transfer error: ${err.message}`);
    return error(res, err.message, err.status || 500);
  }
};

/**
 * GET /api/accounts/:accountNumber/balance
 * Returns the current balance and account details for the given account number.
 */
const getBalance = async (req, res) => {
  try {
    const balance = await bankingService.getBalance(req.params.accountNumber);
    return success(res, 'Account balance retrieved successfully', balance);
  } catch (err) {
    logger.error(`Get balance error: ${err.message}`);
    return error(res, err.message, err.status || 500);
  }
};

module.exports = { saveTransaction, transferFunds, getBalance };

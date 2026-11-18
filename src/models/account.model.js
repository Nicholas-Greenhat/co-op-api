const { queryOne, run } = require('../config/database');

/**
 * Finds an account by its account number.
 * @param {string} accountNumber
 * @returns {object|null} Account row or null if not found
 */
const findByAccountNumber = (accountNumber) =>
  queryOne('SELECT * FROM accounts WHERE account_number = ?', [accountNumber]);

/**
 * Updates the balance of an account.
 * @param {string} accountNumber
 * @param {number} newBalance
 */
const updateBalance = (accountNumber, newBalance) =>
  run('UPDATE accounts SET balance = ? WHERE account_number = ?', [newBalance, accountNumber]);

module.exports = { findByAccountNumber, updateBalance };

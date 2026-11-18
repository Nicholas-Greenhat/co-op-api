const { queryOne, run } = require('../config/database');

/**
 * Persists a new transaction record to the database.
 * @param {object} params
 * @param {string} params.senderAccountNumber
 * @param {string} params.receiverAccountNumber
 * @param {number} params.amount
 * @param {string} [params.description]
 * @param {'PENDING'|'COMPLETED'|'FAILED'} params.status
 * @returns {object} The newly created transaction row
 */
const create = ({ senderAccountNumber, receiverAccountNumber, amount, description, status }) => {
  const id = run(
    'INSERT INTO transactions (sender_account_number, receiver_account_number, amount, description, status) VALUES (?, ?, ?, ?, ?)',
    [senderAccountNumber, receiverAccountNumber, amount, description || null, status]
  );
  return queryOne('SELECT * FROM transactions WHERE id = ?', [id]);
};

module.exports = { create };

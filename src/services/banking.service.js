const { getDb } = require('../config/database');
const AccountModel = require('../models/account.model');
const TransactionModel = require('../models/transaction.model');
const logger = require('../utils/logger');

/**
 * Maps a raw database transaction row to a clean API response object.
 * @param {object} tx - Raw transaction row from the database
 * @returns {object} Formatted transaction object
 */
const formatTransaction = (tx) => ({
  id: tx.id,
  senderAccountNumber: tx.sender_account_number,
  receiverAccountNumber: tx.receiver_account_number,
  amount: tx.amount,
  description: tx.description,
  status: tx.status,
  createdAt: tx.created_at,
});

/**
 * Validates and persists transaction details with a PENDING status.
 * Does NOT move funds between accounts.
 * @param {object} params
 * @param {string} params.senderAccountNumber
 * @param {string} params.receiverAccountNumber
 * @param {number} params.amount
 * @param {string} [params.description]
 * @returns {Promise<object>} The saved transaction
 * @throws {{ status: number, message: string }} If either account does not exist
 */
const saveTransaction = async ({ senderAccountNumber, receiverAccountNumber, amount, description }) => {
  await getDb();
  logger.info(`Saving transaction: ${senderAccountNumber} -> ${receiverAccountNumber}, amount=${amount}`);

  if (!AccountModel.findByAccountNumber(senderAccountNumber))
    throw { status: 400, message: `Sender account not found: ${senderAccountNumber}` };

  if (!AccountModel.findByAccountNumber(receiverAccountNumber))
    throw { status: 400, message: `Receiver account not found: ${receiverAccountNumber}` };

  const tx = TransactionModel.create({ senderAccountNumber, receiverAccountNumber, amount, description, status: 'PENDING' });
  logger.info(`Transaction saved with id=${tx.id}`);
  return formatTransaction(tx);
};

/**
 * Transfers funds from one account to another and records the transaction as COMPLETED.
 * Validates account existence, prevents self-transfers, and checks for sufficient balance.
 * @param {object} params
 * @param {string} params.senderAccountNumber
 * @param {string} params.receiverAccountNumber
 * @param {number} params.amount
 * @param {string} [params.description]
 * @returns {Promise<object>} The completed transaction
 * @throws {{ status: number, message: string }} If validation fails or funds are insufficient
 */
const transferFunds = async ({ senderAccountNumber, receiverAccountNumber, amount, description }) => {
  await getDb();
  logger.info(`Transfer initiated: ${senderAccountNumber} -> ${receiverAccountNumber}, amount=${amount}`);

  const sender = AccountModel.findByAccountNumber(senderAccountNumber);
  if (!sender) throw { status: 400, message: `Sender account not found: ${senderAccountNumber}` };

  const receiver = AccountModel.findByAccountNumber(receiverAccountNumber);
  if (!receiver) throw { status: 400, message: `Receiver account not found: ${receiverAccountNumber}` };

  if (senderAccountNumber === receiverAccountNumber)
    throw { status: 400, message: 'Sender and receiver accounts must be different' };

  if (sender.balance < amount)
    throw { status: 400, message: `Insufficient funds. Available balance: ${sender.balance.toFixed(2)}` };

  AccountModel.updateBalance(senderAccountNumber, sender.balance - amount);
  AccountModel.updateBalance(receiverAccountNumber, receiver.balance + amount);

  const tx = TransactionModel.create({ senderAccountNumber, receiverAccountNumber, amount, description, status: 'COMPLETED' });
  logger.info(`Transfer completed. Transaction id=${tx.id}, new sender balance=${(sender.balance - amount).toFixed(2)}`);
  return formatTransaction(tx);
};

/**
 * Retrieves the current balance for a given account number.
 * @param {string} accountNumber
 * @returns {Promise<object>} Account balance details including currency
 * @throws {{ status: number, message: string }} If the account does not exist
 */
const getBalance = async (accountNumber) => {
  await getDb();
  logger.info(`Fetching balance for account=${accountNumber}`);

  const account = AccountModel.findByAccountNumber(accountNumber);
  if (!account) throw { status: 400, message: `Account not found: ${accountNumber}` };

  return {
    accountNumber: account.account_number,
    ownerName: account.owner_name,
    balance: parseFloat(account.balance.toFixed(2)),
    currency: 'NGN',
  };
};

module.exports = { saveTransaction, transferFunds, getBalance };

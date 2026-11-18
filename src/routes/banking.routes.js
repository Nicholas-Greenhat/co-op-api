const { Router } = require('express');
const controller = require('../controllers/banking.controller');
const { transactionRules, validate } = require('../middleware/validate');

/**
 * Banking API routes:
 *   POST /transactions        — save transaction details (PENDING)
 *   POST /transfers           — transfer funds between accounts (COMPLETED)
 *   GET  /accounts/:id/balance — retrieve current account balance
 */
const router = Router();

router.post('/transactions', transactionRules, validate, controller.saveTransaction);
router.post('/transfers', transactionRules, validate, controller.transferFunds);
router.get('/accounts/:accountNumber/balance', controller.getBalance);

module.exports = router;

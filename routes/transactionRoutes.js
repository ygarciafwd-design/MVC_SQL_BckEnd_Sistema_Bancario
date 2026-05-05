const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController');
const authenticate = require('../middleware/authenticate');

router.post('/transfer', authenticate, TransactionController.transfer);
router.post('/deposit', authenticate, TransactionController.deposit);
router.get('/account/:accountId', authenticate, TransactionController.getByAccount);

module.exports = router;

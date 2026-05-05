const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/AccountController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.get('/', authenticate, authorize('admin'), AccountController.getAll);
router.post('/', authenticate, authorize('admin', 'client'), AccountController.create);
router.get('/:id', authenticate, AccountController.getById);

module.exports = router;

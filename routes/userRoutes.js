const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.get('/', authenticate, authorize('admin'), UserController.getAll);
router.post('/', UserController.create);
router.get('/:id', authenticate, UserController.getById);
router.delete('/:id', authenticate, authorize('admin'), UserController.delete);

module.exports = router;

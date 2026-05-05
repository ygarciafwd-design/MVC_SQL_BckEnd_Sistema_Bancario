const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

router.get('/', authenticate, authorize('admin'), UserController.getAll);
router.post('/', UserController.create); // Registration could be public
router.get('/:id', authenticate, UserController.getById);

module.exports = router;

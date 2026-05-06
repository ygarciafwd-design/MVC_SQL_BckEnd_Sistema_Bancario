const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const authenticate = require('../middleware/authenticate');

// Public routes
router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

// Protected routes (require valid JWT)
router.post('/logout', authenticate, AuthController.logout);
router.get('/profile', authenticate, AuthController.getProfile);

module.exports = router;

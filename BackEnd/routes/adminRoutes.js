const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// All admin routes require authentication + admin role
router.use(authenticate);
router.use(authorize('admin'));

// ---- User Management ----
router.get('/users', AdminController.getAllUsers);
router.get('/users/:id', AdminController.getUserById);
router.post('/users', AdminController.createUser);
router.patch('/users/:id/role', AdminController.updateUserRole);
router.patch('/users/:id/status', AdminController.updateUserStatus);
router.delete('/users/:id', AdminController.deleteUser);

// ---- Role Management ----
router.get('/roles', AdminController.getAllRoles);
router.post('/roles', AdminController.createRole);
router.put('/roles/:id', AdminController.updateRole);
router.delete('/roles/:id', AdminController.deleteRole);

module.exports = router;

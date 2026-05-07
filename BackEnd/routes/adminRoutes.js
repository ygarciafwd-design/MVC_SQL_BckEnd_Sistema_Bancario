const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');

// All routes here require authentication
router.use(authenticate);

// ---- User Management (Admin & Moderador) ----
// Note: AdminController handles the internal hierarchy (moderator cannot touch admins)
router.get('/users', authorize('admin', 'moderador'), AdminController.getAllUsers);
router.get('/users/:id', authorize('admin', 'moderador'), AdminController.getUserById);
router.post('/users', authorize('admin', 'moderador'), AdminController.createUser);
router.patch('/users/:id/role', authorize('admin', 'moderador'), AdminController.updateUserRole);
router.patch('/users/:id/status', authorize('admin', 'moderador'), AdminController.updateUserStatus);
router.delete('/users/:id', authorize('admin', 'moderador'), AdminController.deleteUser);

// ---- Role Management (Admin ONLY) ----
router.get('/roles', authorize('admin', 'moderador'), AdminController.getAllRoles); // Moderators need to see roles to assign them
router.post('/roles', authorize('admin'), AdminController.createRole);
router.put('/roles/:id', authorize('admin'), AdminController.updateRole);
router.delete('/roles/:id', authorize('admin'), AdminController.deleteRole);

module.exports = router;

const bcrypt = require('bcryptjs');
const { User, Role } = require('../models');

/**
 * Admin Controller
 * Only accessible by users with the 'admin' role.
 * Handles user management and role management.
 */
class AdminController {

  // ============================================================
  //  USER MANAGEMENT (Admin only)
  // ============================================================

  /**
   * Get all users with their roles
   */
  static async getAllUsers(req, res) {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['passwordHash'] },
        include: [{ model: Role, as: 'role' }],
        order: [['createdAt', 'DESC']]
      });
      res.json({ users });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get a single user by ID
   */
  static async getUserById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        attributes: { exclude: ['passwordHash'] },
        include: [{ model: Role, as: 'role' }]
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json({ user });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Admin creates a new user (can assign any role)
   */
  static async createUser(req, res) {
    try {
      const { firstName, lastName, email, password, identityDocument, role_id, status, phone } = req.body;

      // 1. Validate required fields
      if (!firstName || !lastName || !email || !password || !identityDocument) {
        return res.status(400).json({ message: 'Required fields: firstName, lastName, email, password, identityDocument' });
      }

      // 2. Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      // 3. Password strength
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }

      // 4. Check existing user
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({ message: 'A user with this email already exists' });
      }

      // 5. Validate role_id if provided
      if (role_id) {
        const roleExists = await Role.findByPk(role_id);
        if (!roleExists) {
          return res.status(400).json({ message: `Role with id ${role_id} does not exist` });
        }

        // Hierarchy check for creation
        if (req.user.role.name === 'moderador' && roleExists.name === 'admin') {
          return res.status(403).json({ message: 'Privileges insufficient: Moderators cannot create admins' });
        }
      } else {
        // Default to 'client' role
        const clientRole = await Role.findOne({ where: { name: 'client' } });
        if (!clientRole) {
          return res.status(500).json({ message: 'Default role not found' });
        }
        req.body.role_id = clientRole.id;
      }

      // 6. Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // 7. Create user
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        passwordHash,
        identityDocument,
        phone: phone || null,
        role_id: role_id || req.body.role_id,
        status: status || 'active'
      });

      // 8. Fetch created user with role
      const createdUser = await User.findByPk(newUser.id, {
        attributes: { exclude: ['passwordHash'] },
        include: [{ model: Role, as: 'role' }]
      });

      res.status(201).json({
        message: 'User created successfully by admin',
        user: createdUser
      });
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(e => e.message);
        return res.status(400).json({ message: messages.join(', ') });
      }
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ message: 'Email or identity document already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Update a user's role
   */
  static async updateUserRole(req, res) {
    try {
      const { id } = req.params;
      const { role_id } = req.body;

      if (!role_id) {
        return res.status(400).json({ message: 'role_id is required' });
      }

      // Validate role exists
      const role = await Role.findByPk(role_id);
      if (!role) {
        return res.status(400).json({ message: `Role with id ${role_id} does not exist` });
      }

      // Find user with role
      const user = await User.findByPk(id, { include: [{ model: Role, as: 'role' }] });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Hierarchy check: Moderator cannot change role of an Admin
      if (req.user.role.name === 'moderador' && user.role.name === 'admin') {
        return res.status(403).json({ message: 'Privileges insufficient: Moderators cannot modify admins' });
      }

      // Hierarchy check: Moderator cannot promote someone to Admin
      if (req.user.role.name === 'moderador' && role.name === 'admin') {
        return res.status(403).json({ message: 'Privileges insufficient: Moderators cannot assign admin role' });
      }

      // Prevent admin from demoting themselves
      if (user.id === req.user.id && role.name !== 'admin') {
        return res.status(400).json({ message: 'You cannot change your own admin role' });
      }

      // Update
      await user.update({ role_id });

      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ['passwordHash'] },
        include: [{ model: Role, as: 'role' }]
      });

      res.json({ message: 'User role updated successfully', user: updatedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Update user status (active, inactive, blocked)
   */
  static async updateUserStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['active', 'inactive', 'blocked', 'pending'];
      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
      }

      const user = await User.findByPk(id, { include: [{ model: Role, as: 'role' }] });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Hierarchy check: Moderator cannot change status of an Admin
      if (req.user.role.name === 'moderador' && user.role.name === 'admin') {
        return res.status(403).json({ message: 'Privileges insufficient: Moderators cannot modify admins' });
      }

      // Prevent admin from blocking themselves
      if (user.id === req.user.id && status !== 'active') {
        return res.status(400).json({ message: 'You cannot deactivate your own account' });
      }

      await user.update({ status });

      res.json({ message: `User status updated to '${status}'`, user: { id: user.id, status } });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Delete a user (only if not admin deleting themselves)
   */
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findByPk(id, { include: [{ model: Role, as: 'role' }] });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Hierarchy check: Moderator cannot delete an Admin
      if (req.user.role.name === 'moderador' && user.role.name === 'admin') {
        return res.status(403).json({ message: 'Privileges insufficient: Moderators cannot delete admins' });
      }

      if (user.id === req.user.id) {
        return res.status(400).json({ message: 'You cannot delete your own account' });
      }

      await user.destroy();
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ============================================================
  //  ROLE MANAGEMENT (Admin only)
  // ============================================================

  /**
   * Get all roles
   */
  static async getAllRoles(req, res) {
    try {
      const roles = await Role.findAll({ order: [['id', 'ASC']] });
      res.json({ roles });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Create a new role
   */
  static async createRole(req, res) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Role name is required' });
      }

      // Check if role name already exists
      const existing = await Role.findOne({ where: { name } });
      if (existing) {
        return res.status(409).json({ message: `Role '${name}' already exists` });
      }

      const role = await Role.create({ name, description: description || null });
      res.status(201).json({ message: 'Role created successfully', role });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Update a role
   */
  static async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      const role = await Role.findByPk(id);
      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }

      // Prevent renaming core roles
      if (['admin', 'client'].includes(role.name) && name && name !== role.name) {
        return res.status(400).json({ message: `Cannot rename the core role '${role.name}'` });
      }

      await role.update({
        name: name || role.name,
        description: description !== undefined ? description : role.description
      });

      res.json({ message: 'Role updated successfully', role });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ message: 'A role with this name already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Delete a role (cannot delete core roles or roles in use)
   */
  static async deleteRole(req, res) {
    try {
      const { id } = req.params;
      const role = await Role.findByPk(id);

      if (!role) {
        return res.status(404).json({ message: 'Role not found' });
      }

      // Prevent deleting core roles
      if (['admin', 'client'].includes(role.name)) {
        return res.status(400).json({ message: `Cannot delete the core role '${role.name}'` });
      }

      // Check if any users have this role
      const usersWithRole = await User.count({ where: { role_id: id } });
      if (usersWithRole > 0) {
        return res.status(400).json({ 
          message: `Cannot delete role '${role.name}'. ${usersWithRole} user(s) still assigned to it.` 
        });
      }

      await role.destroy();
      res.json({ message: 'Role deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AdminController;

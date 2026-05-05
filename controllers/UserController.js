const { User, Account } = require('../models');
const bcrypt = require('bcryptjs');

/**
 * Controller for User operations
 */
class UserController {
  /**
   * Get all users
   */
  static async getAll(req, res) {
    try {
      const users = await User.findAll({
        include: [{ model: Account, as: 'accounts' }]
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Create a new user
   */
  static async create(req, res) {
    try {
      const userData = { ...req.body };
      
      // Hash password if provided
      if (userData.passwordHash) {
        const salt = await bcrypt.genSalt(10);
        userData.passwordHash = await bcrypt.hash(userData.passwordHash, salt);
      }
      
      // Default new users to 'active' for testing purposes, or keep 'pending' and require admin approval
      // For this project, we'll set it to active to test login immediately if not provided
      if (!userData.status) {
          userData.status = 'active';
      }

      const user = await User.create(userData);
      
      // Remove passwordHash from response
      const userResponse = user.toJSON();
      delete userResponse.passwordHash;
      
      res.status(201).json(userResponse);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get user by ID
   */
  static async getById(req, res) {
    try {
      const user = await User.findByPk(req.params.id, {
        include: [{ model: Account, as: 'accounts' }]
      });
      if (!user) return res.status(404).json({ message: 'User not found' });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = UserController;

const { Account, AccountType, User } = require('../models');

/**
 * Controller for Account operations
 */
class AccountController {
  /**
   * Get all accounts
   */
  static async getAll(req, res) {
    try {
      const accounts = await Account.findAll({
        include: [
          { model: User, as: 'user' },
          { model: AccountType, as: 'accountType' }
        ]
      });
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Create a new account
   */
  static async create(req, res) {
    try {
      const { userId, accountTypeId, balance, currency } = req.body;
      
      // Basic validation
      if (!userId || !accountTypeId) {
        return res.status(400).json({ message: 'User ID and Account Type ID are required' });
      }

      // Generate a random account number (mock)
      const accountNumber = Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');

      const account = await Account.create({
        accountNumber,
        userId,
        accountTypeId,
        balance: balance || 0,
        currency: currency || 'USD',
        status: 'active'
      });

      res.status(201).json(account);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get account by ID
   */
  static async getById(req, res) {
    try {
      const account = await Account.findByPk(req.params.id, {
        include: [
          { model: User, as: 'user' },
          { model: AccountType, as: 'accountType' }
        ]
      });
      if (!account) return res.status(404).json({ message: 'Account not found' });
      res.json(account);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Delete an account
   */
  static async delete(req, res) {
    try {
      const account = await Account.findByPk(req.params.id);
      if (!account) return res.status(404).json({ message: 'Account not found' });
      
      await account.destroy();
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AccountController;

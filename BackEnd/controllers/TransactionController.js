const { Transaction, Account, TransactionType, sequelize, AuditLog } = require('../models');
const { v4: uuidv4 } = require('uuid');

/**
 * Controller for Transaction operations with complex business logic
 */
class TransactionController {
  /**
   * Handle money transfer between two accounts (Complex Logic)
   */
  static async transfer(req, res) {
    const t = await sequelize.transaction();
    try {
      const { sourceAccountId, destinationAccountId, amount, description } = req.body;

      // 1. Validation: Basic checks
      if (sourceAccountId === destinationAccountId) {
        throw new Error('Source and destination accounts must be different');
      }
      if (amount <= 0) {
        throw new Error('Amount must be greater than zero');
      }

      // 2. Fetch Accounts
      const sourceAccount = await Account.findByPk(sourceAccountId, { transaction: t, lock: t.LOCK.UPDATE });
      const destinationAccount = await Account.findByPk(destinationAccountId, { transaction: t, lock: t.LOCK.UPDATE });

      if (!sourceAccount) throw new Error('Source account not found');
      if (!destinationAccount) throw new Error('Destination account not found');
      if (sourceAccount.status !== 'active') throw new Error('Source account is not active');
      if (destinationAccount.status !== 'active') throw new Error('Destination account is not active');

      // 3. Validation: Sufficient balance
      if (parseFloat(sourceAccount.balance) < parseFloat(amount)) {
        throw new Error('Insufficient funds in source account');
      }

      // 4. Update Balances
      sourceAccount.balance = parseFloat(sourceAccount.balance) - parseFloat(amount);
      destinationAccount.balance = parseFloat(destinationAccount.balance) + parseFloat(amount);

      await sourceAccount.save({ transaction: t });
      await destinationAccount.save({ transaction: t });

      // 5. Create Transaction Record
      const transferType = await TransactionType.findOne({ where: { name: 'Transferencia' } });
      
      const transactionRecord = await Transaction.create({
        referenceNumber: `TRF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        sourceAccountId,
        destinationAccountId,
        transactionTypeId: transferType.id,
        amount,
        description: description || 'Transfer between accounts',
        status: 'completed',
        currency: sourceAccount.currency
      }, { transaction: t });

      // 6. Audit Log
      await AuditLog.create({
        userId: sourceAccount.userId,
        action: 'TRANSFER',
        entity: 'Transaction',
        entityId: transactionRecord.id,
        previousData: { balance: parseFloat(sourceAccount.balance) + parseFloat(amount) },
        newData: { balance: parseFloat(sourceAccount.balance) },
        ipAddress: req.ip
      }, { transaction: t });

      await t.commit();
      res.status(201).json({ message: 'Transfer successful', transaction: transactionRecord });
    } catch (error) {
      await t.rollback();
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Handle Deposit
   */
  static async deposit(req, res) {
    const t = await sequelize.transaction();
    try {
      const { accountId, amount, description } = req.body;
      
      const account = await Account.findByPk(accountId, { transaction: t, lock: t.LOCK.UPDATE });
      if (!account) throw new Error('Account not found');

      account.balance = parseFloat(account.balance) + parseFloat(amount);
      await account.save({ transaction: t });

      const depositType = await TransactionType.findOne({ where: { name: 'Depósito' } });

      const transactionRecord = await Transaction.create({
        referenceNumber: `DEP-${Date.now()}`,
        destinationAccountId: accountId,
        transactionTypeId: depositType.id,
        amount,
        description: description || 'Cash deposit',
        status: 'completed',
        currency: account.currency
      }, { transaction: t });

      await t.commit();
      res.status(201).json(transactionRecord);
    } catch (error) {
      await t.rollback();
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * Get all transactions for an account
   */
  static async getByAccount(req, res) {
    try {
      const transactions = await Transaction.findAll({
        where: sequelize.or(
          { source_account_id: req.params.accountId },
          { destination_account_id: req.params.accountId }
        ),
        include: [{ model: TransactionType, as: 'transactionType' }],
        order: [['created_at', 'DESC']]
      });
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = TransactionController;

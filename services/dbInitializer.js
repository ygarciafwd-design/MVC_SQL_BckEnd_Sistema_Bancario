const { AccountType, TransactionType } = require('../models');
const { accountTypes, transactionTypes } = require('../utils/initialData');

/**
 * Service to initialize the database with master data if it's empty
 */
const initializeDatabase = async () => {
  try {
    console.log('Checking database master data...');

    // 1. Initialize Account Types
    const accountTypeCount = await AccountType.count();
    if (accountTypeCount === 0) {
      console.log('Seeding Account Types...');
      await AccountType.bulkCreate(accountTypes);
      console.log('Account Types seeded successfully.');
    }

    // 2. Initialize Transaction Types
    const transactionTypeCount = await TransactionType.count();
    if (transactionTypeCount === 0) {
      console.log('Seeding Transaction Types...');
      await TransactionType.bulkCreate(transactionTypes);
      console.log('Transaction Types seeded successfully.');
    }

    console.log('Database initialization check complete.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = {
  initializeDatabase
};

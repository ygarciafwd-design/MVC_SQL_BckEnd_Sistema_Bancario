'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('transactions', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      reference_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
      },
      source_account_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'accounts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      destination_account_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'accounts',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      transaction_type_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'transaction_types',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      amount: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed', 'cancelled', 'reversed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    await queryInterface.addIndex('transactions', ['source_account_id'], {
      name: 'idx_transactions_source_account_id',
    });

    await queryInterface.addIndex('transactions', ['destination_account_id'], {
      name: 'idx_transactions_destination_account_id',
    });

    await queryInterface.addIndex('transactions', ['transaction_type_id'], {
      name: 'idx_transactions_transaction_type_id',
    });

    await queryInterface.addIndex('transactions', ['status'], {
      name: 'idx_transactions_status',
    });

    await queryInterface.addIndex('transactions', ['created_at'], {
      name: 'idx_transactions_created_at',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('transactions');
  },
};

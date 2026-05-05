'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
 * Transaction Model
 * Records any financial movement in the system.
 * 
 * @property {number} id - Primary Key
 * @property {string} referenceNumber - Unique transaction reference
 * @property {number} sourceAccountId - Origin account (optional for deposits)
 * @property {number} destinationAccountId - Target account (optional for withdrawals)
 * @property {number} transactionTypeId - Type of transaction
 * @property {number} amount - Monetary value
 * @property {string} currency - Currency code
 * @property {string} description - Memo or note
 * @property {string} status - Transaction status (pending, completed, failed, cancelled, reversed)
 */
class Transaction extends Model {
  /**
   * Defines associations with other models.
   * @param {Object} models - Registry of all initialized models.
   */
  static associate(models) {
      Transaction.belongsTo(models.Account, {
        foreignKey: 'source_account_id',
        as: 'sourceAccount',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });

      Transaction.belongsTo(models.Account, {
        foreignKey: 'destination_account_id',
        as: 'destinationAccount',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });

      Transaction.belongsTo(models.TransactionType, {
        foreignKey: 'transaction_type_id',
        as: 'transactionType',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
    }
  }

  Transaction.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      referenceNumber: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'reference_number',
        validate: {
          notEmpty: true,
        },
      },
      sourceAccountId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        field: 'source_account_id',
        references: {
          model: 'accounts',
          key: 'id',
        },
      },
      destinationAccountId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        field: 'destination_account_id',
        references: {
          model: 'accounts',
          key: 'id',
        },
      },
      transactionTypeId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'transaction_type_id',
        references: {
          model: 'transaction_types',
          key: 'id',
        },
      },
      amount: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        validate: {
          isDecimal: true,
          min: 0.01,
        },
      },
      currency: {
        type: DataTypes.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
        validate: {
          isAlpha: true,
          len: [3, 3],
          isUppercase: true,
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled', 'reversed'),
        allowNull: false,
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'Transaction',
      tableName: 'transactions',
      underscored: true,
      timestamps: true,
    }
  );

  return Transaction;
};

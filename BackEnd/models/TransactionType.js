'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
 * TransactionType Model
 * Defines different types of transactions (e.g., Deposit, Withdrawal, Transfer).
 * 
 * @property {number} id - Primary Key
 * @property {string} name - Human readable name
 * @property {string} description - Detailed explanation of the transaction type
 */
class TransactionType extends Model {
  /**
   * Defines associations with other models.
   * @param {Object} models - Registry of all initialized models.
   */
  static associate(models) {
      TransactionType.hasMany(models.Transaction, {
        foreignKey: 'transaction_type_id',
        as: 'transactions',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
    }
  }

  TransactionType.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
          len: [2, 50],
        },
      },
      description: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'TransactionType',
      tableName: 'transaction_types',
      underscored: true,
      timestamps: true,
    }
  );

  return TransactionType;
};

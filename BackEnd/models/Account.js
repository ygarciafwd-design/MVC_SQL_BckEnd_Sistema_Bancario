'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
 * Account Model
 * Represents a financial account belonging to a user.
 * 
 * @property {number} id - Primary Key
 * @property {string} accountNumber - Unique account number
 * @property {number} userId - ID of the owner
 * @property {number} accountTypeId - ID of the type of account
 * @property {number} balance - Current balance
 * @property {string} currency - Currency code (e.g., USD)
 * @property {string} status - Account status (active, inactive, frozen, closed)
 */
class Account extends Model {
  /**
   * Defines associations with other models.
   * @param {Object} models - Registry of all initialized models.
   */
  static associate(models) {
      Account.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });

      Account.belongsTo(models.AccountType, {
        foreignKey: 'account_type_id',
        as: 'accountType',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });

      Account.hasMany(models.Transaction, {
        foreignKey: 'source_account_id',
        as: 'outgoingTransactions',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });

      Account.hasMany(models.Transaction, {
        foreignKey: 'destination_account_id',
        as: 'incomingTransactions',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
    }
  }

  Account.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      accountNumber: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        field: 'account_number',
        validate: {
          notEmpty: true,
        },
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      accountTypeId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        field: 'account_type_id',
        references: {
          model: 'account_types',
          key: 'id',
        },
      },
      balance: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0.0,
        validate: {
          isDecimal: true,
          min: 0,
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
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'frozen', 'closed'),
        allowNull: false,
        defaultValue: 'active',
      },
    },
    {
      sequelize,
      modelName: 'Account',
      tableName: 'accounts',
      underscored: true,
      timestamps: true,
    }
  );

  return Account;
};

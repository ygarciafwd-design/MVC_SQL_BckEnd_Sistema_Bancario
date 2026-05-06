'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
 * AccountType Model
 * Defines different types of accounts (e.g., Savings, Checking).
 * 
 * @property {number} id - Primary Key
 * @property {string} name - Human readable name
 * @property {string} description - Detailed explanation of the account type
 */
class AccountType extends Model {
  /**
   * Defines associations with other models.
   * @param {Object} models - Registry of all initialized models.
   */
  static associate(models) {
      AccountType.hasMany(models.Account, {
        foreignKey: 'account_type_id',
        as: 'accounts',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });
    }
  }

  AccountType.init(
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
      modelName: 'AccountType',
      tableName: 'account_types',
      underscored: true,
      timestamps: true,
    }
  );

  return AccountType;
};

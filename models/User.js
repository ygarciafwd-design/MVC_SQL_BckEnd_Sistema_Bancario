'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Account, {
        foreignKey: 'user_id',
        as: 'accounts',
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      });

      User.hasMany(models.AuditLog, {
        foreignKey: 'user_id',
        as: 'auditLogs',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'first_name',
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
        field: 'last_name',
        validate: {
          notEmpty: true,
          len: [2, 100],
        },
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      passwordHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'password_hash',
        validate: {
          notEmpty: true,
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          is: /^[+]?[\d\s()-]+$/i,
        },
      },
      identityDocument: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        field: 'identity_document',
        validate: {
          notEmpty: true,
        },
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'blocked', 'pending'),
        allowNull: false,
        defaultValue: 'pending',
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      timestamps: true,
    }
  );

  return User;
};

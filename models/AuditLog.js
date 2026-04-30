'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    static associate(models) {
      AuditLog.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user',
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      });
    }
  }

  AuditLog.init(
    {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        field: 'user_id',
        references: {
          model: 'users',
          key: 'id',
        },
      },
      action: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      entity: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      entityId: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: true,
        field: 'entity_id',
      },
      previousData: {
        type: DataTypes.JSON,
        allowNull: true,
        field: 'previous_data',
      },
      newData: {
        type: DataTypes.JSON,
        allowNull: true,
        field: 'new_data',
      },
      ipAddress: {
        type: DataTypes.STRING(45),
        allowNull: true,
        field: 'ip_address',
        validate: {
          isIP: true,
        },
      },
    },
    {
      sequelize,
      modelName: 'AuditLog',
      tableName: 'audit_logs',
      underscored: true,
      timestamps: true,
    }
  );

  return AuditLog;
};

'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  /**
 * AuditLog Model
 * Tracks all sensitive actions performed by users in the system.
 * 
 * @property {number} id - Primary Key
 * @property {number} userId - ID of the user who performed the action
 * @property {string} action - Description of the action (e.g., TRANSFER)
 * @property {string} entity - Name of the affected entity
 * @property {number} entityId - ID of the affected record
 * @property {Object} previousData - State before the action
 * @property {Object} newData - State after the action
 * @property {string} ipAddress - IP address of the requester
 */
class AuditLog extends Model {
  /**
   * Defines associations with other models.
   * @param {Object} models - Registry of all initialized models.
   */
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

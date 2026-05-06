'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Crear tabla roles
    await queryInterface.createTable('roles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // 2. Insertar roles iniciales
    await queryInterface.bulkInsert('roles', [
      { name: 'admin', description: 'Administrador del sistema', created_at: new Date(), updated_at: new Date() },
      { name: 'client', description: 'Cliente regular', created_at: new Date(), updated_at: new Date() }
    ]);

    // 3. Añadir columna role_id a users (allowNull true temporalmente)
    await queryInterface.addColumn('users', 'role_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: true,
      references: {
        model: 'roles',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    });

    // 4. Migrar los datos de role (ENUM) a role_id
    // ID 1 = admin, ID 2 = client
    await queryInterface.sequelize.query(
      `UPDATE users SET role_id = CASE WHEN role = 'admin' THEN 1 ELSE 2 END`
    );

    // 5. Hacer role_id NOT NULL
    await queryInterface.changeColumn('users', 'role_id', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false
    });

    // 6. Eliminar columna antigua
    await queryInterface.removeColumn('users', 'role');
    
    // Clean up ENUM type in MySQL if needed
    await queryInterface.sequelize.query(
      "ALTER TABLE `users` DROP COLUMN IF EXISTS `role`;"
    ).catch(() => {});
  },

  async down(queryInterface, Sequelize) {
    // 1. Añadir columna antigua role
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'client'),
      allowNull: false,
      defaultValue: 'client'
    });

    // 2. Revertir datos (asumiendo ID 1 es admin, el resto client)
    await queryInterface.sequelize.query(
      `UPDATE users SET role = CASE WHEN role_id = 1 THEN 'admin' ELSE 'client' END`
    );

    // 3. Eliminar Foreign Key y columna
    // sequelize-cli automatically creates fk names like users_role_id_foreign_idx
    // but better to remove column which drops FK if db supports it, or use removeConstraint
    // For MySQL we might need to remove constraint first.
    // The safest way is to let sequelize handle it or just drop column, drop table.
    
    // In many dialects, removeColumn drops the constraint automatically or we do it explicitly:
    try {
      const constraints = await queryInterface.getForeignKeyReferencesForTable('users');
      const roleIdConstraint = constraints.find(c => c.columnName === 'role_id');
      if (roleIdConstraint) {
        await queryInterface.removeConstraint('users', roleIdConstraint.constraintName);
      }
    } catch(e) {}
    
    await queryInterface.removeColumn('users', 'role_id');

    // 4. Eliminar tabla roles
    await queryInterface.dropTable('roles');
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'role', {
      type: Sequelize.ENUM('admin', 'client'),
      allowNull: false,
      defaultValue: 'client',
      after: 'status',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('users', 'role');
    // Clean up ENUM type in MySQL
    await queryInterface.sequelize.query(
      "ALTER TABLE `users` DROP COLUMN IF EXISTS `role`;"
    ).catch(() => {});
  },
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('transaction_types', [
      {
        name: 'Depósito',
        description: 'Ingreso de fondos a una cuenta bancaria',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Retiro',
        description: 'Extracción de fondos de una cuenta bancaria',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Transferencia',
        description: 'Movimiento de fondos entre cuentas bancarias',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Pago de Servicios',
        description: 'Pago a terceros por servicios contratados',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('transaction_types', null, {});
  },
};

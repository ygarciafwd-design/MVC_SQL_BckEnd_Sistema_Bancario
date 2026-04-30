'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('account_types', [
      {
        name: 'Ahorro',
        description: 'Cuenta de ahorro con intereses generados periódicamente',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Corriente',
        description: 'Cuenta corriente para uso diario con chequera disponible',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Nómina',
        description: 'Cuenta para recepción de pagos salariales',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Plazo Fijo',
        description: 'Cuenta con depósito a plazo fijo con tasa de interés preferencial',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('account_types', null, {});
  },
};

/**
 * Initial static data for the banking system
 */

const accountTypes = [
  {
    name: 'Cuenta de Ahorros',
    description: 'Cuenta para ahorros con intereses'
  },
  {
    name: 'Cuenta Corriente',
    description: 'Cuenta para transacciones diarias'
  },
  {
    name: 'Tarjeta de Crédito',
    description: 'Línea de crédito rotativo'
  }
];

const transactionTypes = [
  {
    name: 'Depósito',
    description: 'Ingreso de dinero a la cuenta'
  },
  {
    name: 'Retiro',
    description: 'Salida de dinero de la cuenta'
  },
  {
    name: 'Transferencia',
    description: 'Movimiento de dinero entre cuentas'
  },
  {
    name: 'Pago de Servicio',
    description: 'Pago a proveedores de servicios'
  }
];

module.exports = {
  accountTypes,
  transactionTypes
};

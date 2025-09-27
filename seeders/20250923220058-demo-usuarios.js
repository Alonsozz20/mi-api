'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Crear contraseñas encriptadas
    const passwordHash = await bcrypt.hash('123456', 10);
    const adminPasswordHash = await bcrypt.hash('admin123', 10);

    await queryInterface.bulkInsert('Usuarios', [
      {
        nombre: 'Juan Pérez',
        email: 'juan@ejemplo.com',
        password: passwordHash,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'María García',
        email: 'maria@ejemplo.com',
        password: passwordHash,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Carlos López',
        email: 'carlos@ejemplo.com',
        password: passwordHash,
        activo: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: 'Admin Sistema',
        email: 'admin@ejemplo.com',
        password: adminPasswordHash,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Usuarios', null, {});
  }
};
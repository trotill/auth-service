'use strict';
const jshashes = require('jshashes');
const login="admin"
const password="admin"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwd=new jshashes.SHA1().b64(login + password)
    console.log('admin password',passwd)
    try {
       await queryInterface.bulkInsert('users', [{
        login: 'admin',
        role: 'admin',
        firstName: 'firstName',
        password: new jshashes.SHA1().b64(login + password),
        lastName: 'lastName',
        email: 'email',
        createdAt: new Date(),
        updatedAt: new Date()
      }]);

    }catch
    {
      console.log('already inserted!!!')
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};

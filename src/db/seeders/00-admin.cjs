'use strict';
const jshashes = require('jshashes');
const login="admin"
const password="admin"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const passwd=new jshashes.SHA1().b64(login + password)
    console.log('admin password',passwd)
    return queryInterface.bulkInsert('users', [{
      login: 'admin',
      role: 'admin',
      firstName:'firstName',
      password: new jshashes.SHA1().b64(login + password),
      lastName:'lastName',
      email:'email',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};

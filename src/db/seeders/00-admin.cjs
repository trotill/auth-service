'use strict';
const crypto = require('crypto');
const login="admin"
const password="admin"

function getPasswordHash(password) {
    return crypto.createHash('sha256').update(password).digest('base64');
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // for browser use jshashes library
    // const passwd=new jshashes.SHA1().b64(login + password)
    const passwd =crypto.createHash('sha1').update(login + password).digest('base64')
    // 3ZRwlSi7HIPQjzCI1AQ/R0KJH08= for test
    try {
       await queryInterface.bulkInsert('users', [{
        login: 'admin',
        role: 'admin',
        firstName: 'firstName',
        password: getPasswordHash(passwd),
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

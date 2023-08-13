'use strict';
const {getPasswordHash} = require("../../utils/jsutils.cjs");
const login="admin"
const password="admin"


module.exports = {
  up: async (queryInterface, Sequelize) => {
    // for browser use jshashes library
    // const saltedHashedPassword=new jshashes.SHA256().b64(login + password)
    const saltedHashedPassword = getPasswordHash(login + password)
    // 2CSU8F1pF7oC96qilonMtES7c/IDgIdssF0fN1N7eJI= for test
    try {
       await queryInterface.bulkInsert('users', [{
        login: 'admin',
        role: 'admin',
        firstName: 'firstName',
        password: getPasswordHash(saltedHashedPassword),
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

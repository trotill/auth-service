const { UsersModel } = require('../models/users.model');
require('dotenv').config({ path: '.env' });

const models = [UsersModel];
module.exports = {
  development: {
    username: process.env.DB_PATH,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    storage: process.env.DB_PATH,
    dialect: 'sqlite',
    logging: false,
    define: {
      freezeTableName: true,
    },
    models,
  },
};

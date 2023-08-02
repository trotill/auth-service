const path = require('node:path');
require('dotenv').config({ path: '.env' });

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    storage: path.resolve(process.env.STORE_PATH, process.env.DB_PATH),
    dialect: 'sqlite',
    logging: false,
    define: {
      freezeTableName: true,
    },
  },
};

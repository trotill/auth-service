'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
  };
  User.init({
    login: {
      type:DataTypes.STRING,
      primaryKey: true
    },
    role:DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    locked:DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'user',
    freezeTableName: true
  });
  return User;
};

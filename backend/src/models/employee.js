const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Employee = sequelize.define('employee', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  organisation_id: { type: DataTypes.INTEGER, allowNull: false },
  first_name: DataTypes.STRING,
  last_name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
}, { underscored: true });

module.exports = Employee;

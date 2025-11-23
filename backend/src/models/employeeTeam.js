const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const EmployeeTeam = sequelize.define('employee_team', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employee_id: { type: DataTypes.INTEGER, allowNull: false },
  team_id: { type: DataTypes.INTEGER, allowNull: false },
}, { underscored: true, timestamps: true });

module.exports = EmployeeTeam;

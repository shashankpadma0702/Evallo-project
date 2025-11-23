const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Team = sequelize.define('team', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  organisation_id: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
}, { underscored: true });

module.exports = Team;

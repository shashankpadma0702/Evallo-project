const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Organisation = sequelize.define('organisation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
}, { underscored: true });

module.exports = Organisation;

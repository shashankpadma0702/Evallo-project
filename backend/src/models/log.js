const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Log = sequelize.define('log', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  organisation_id: DataTypes.INTEGER,
  user_id: DataTypes.INTEGER,
  action: DataTypes.STRING,
  meta: DataTypes.JSONB,
}, { underscored: true, timestamps: true });

module.exports = Log;

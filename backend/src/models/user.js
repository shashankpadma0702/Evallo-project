const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Organisation = require('./organisation');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  organisation_id: { type: DataTypes.INTEGER, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING },
}, { underscored: true });

User.belongsTo(Organisation, { foreignKey: 'organisation_id' });
module.exports = User;

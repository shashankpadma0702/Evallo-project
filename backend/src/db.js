// backend/src/db.js (use SQLite for local dev)
const { Sequelize } = require("sequelize");
require("dotenv").config();

const dialect = process.env.DB_DIALECT || "sqlite";

let sequelize;
if (dialect === "sqlite") {
  const storage = process.env.DB_STORAGE || "database.sqlite";
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage,
    logging: false,
  });
} else {
  // fallback to postgres if you later want to use it
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 5432,
      dialect: "postgres",
      logging: false,
    }
  );
}

module.exports = sequelize;

// backend/src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const sequelize = require("./db");

// models (ensure these files exist in src/models)
const Organisation = require("./models/organisation");
const User = require("./models/user");
const Employee = require("./models/employee");
const Team = require("./models/team");
const EmployeeTeam = require("./models/employeeTeam");
const Log = require("./models/log");

const app = express();
app.use(cors());
app.use(express.json());

// Simple health route
app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// Helper: safe loader for routes
function safeLoadRoute(path) {
  try {
    const router = require(path);
    // if module exports a function or express router, return it
    if (
      typeof router === "function" ||
      (router && typeof router.use === "function")
    ) {
      return router;
    }
    console.warn(
      `Route at ${path} did not export a router/function. Using fallback 404 handler.`
    );
  } catch (err) {
    console.warn(`Could not load route ${path}: ${err.message}`);
  }
  // fallback router that returns 404 JSON
  const fallback = express.Router();
  fallback.use((req, res) =>
    res.status(404).json({ message: "Not implemented" })
  );
  return fallback;
}

// Mount routes safely
app.use("/api/auth", safeLoadRoute("./routes/auth"));
app.use("/api/employees", safeLoadRoute("./routes/employees"));
app.use("/api/teams", safeLoadRoute("./routes/teams"));
app.use("/api/logs", safeLoadRoute("./routes/logs"));

// Set up associations (Sequelize)
try {
  Employee.belongsTo(Organisation, { foreignKey: "organisation_id" });
  Team.belongsTo(Organisation, { foreignKey: "organisation_id" });

  Employee.belongsToMany(Team, {
    through: EmployeeTeam,
    foreignKey: "employee_id",
    otherKey: "team_id",
  });
  Team.belongsToMany(Employee, {
    through: EmployeeTeam,
    foreignKey: "team_id",
    otherKey: "employee_id",
  });
} catch (err) {
  console.warn("Association warning:", err.message || err);
}

const PORT = process.env.PORT || 5000;

(async function start() {
  try {
    // For development: sync DB (use migrations in production)
    await sequelize.sync({ alter: true });
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Backend server listening on ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();

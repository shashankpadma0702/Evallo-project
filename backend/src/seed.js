// backend/src/seed.js
const sequelize = require("./db");
const Organisation = require("./models/organisation");
const User = require("./models/user");
const bcrypt = require("bcrypt");

async function seed() {
  try {
    await sequelize.sync({ force: true });
    const org = await Organisation.create({ name: "Demo Org" });
    const hash = await bcrypt.hash("password", 10);
    const user = await User.create({
      organisation_id: org.id,
      email: "admin@example.com",
      password_hash: hash,
      name: "Admin",
    });
    console.log("Seed complete:", {
      orgId: org.id,
      userId: user.id,
      email: "admin@example.com",
      password: "password",
    });
    process.exit(0);
  } catch (err) {
    console.error("Seed error", err);
    process.exit(1);
  }
}

seed();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Organisation = require('../models/organisation');
const User = require('../models/user');
const Log = require('../models/log');

exports.register = async (req, res) => {
  const { orgName, adminName, email, password } = req.body;
  const t = await require('../db').transaction();
  try {
    const org = await Organisation.create({ name: orgName }, { transaction: t });
    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({ organisation_id: org.id, email, password_hash, name: adminName }, { transaction: t });
    await Log.create({ organisation_id: org.id, user_id: user.id, action: 'organisation_created', meta: { orgId: org.id } }, { transaction: t });
    await t.commit();
    const token = jwt.sign({ userId: user.id, orgId: org.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name }});
  } catch (err) {
    await t.rollback();
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id, orgId: user.organisation_id }, process.env.JWT_SECRET, { expiresIn: '8h' });
  await Log.create({ organisation_id: user.organisation_id, user_id: user.id, action: 'user_logged_in', meta: {} });
  res.json({ token });
};

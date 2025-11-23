const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Organisation = require('../models/organisation');
const Log = require('../models/log');

router.post('/register', async (req, res) => {
  try {
    const { orgName, adminName, email, password } = req.body;
    const org = await Organisation.create({ name: orgName });
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ organisation_id: org.id, email, password_hash: hash, name: adminName });
    await Log.create({ organisation_id: org.id, user_id: user.id, action: 'organisation_created', meta: { orgId: org.id } });
    const token = jwt.sign({ userId: user.id, orgId: org.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user.id, orgId: user.organisation_id }, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
    await Log.create({ organisation_id: user.organisation_id, user_id: user.id, action: 'user_logged_in', meta: {} });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name }});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message || 'Login failed' });
  }
});

module.exports = router;

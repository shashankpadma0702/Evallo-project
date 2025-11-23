const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const Employee = require('../models/employee');
const Log = require('../models/log');

router.use(authMiddleware);

// list
router.get('/', async (req, res) => {
  const orgId = req.user.orgId;
  const employees = await Employee.findAll({ where: { organisation_id: orgId }});
  res.json(employees);
});

// create
router.post('/', async (req, res) => {
  const orgId = req.user.orgId;
  const { first_name, last_name, email, phone } = req.body;
  const emp = await Employee.create({ organisation_id: orgId, first_name, last_name, email, phone });
  await Log.create({ organisation_id: orgId, user_id: req.user.userId, action: 'employee_created', meta: { employeeId: emp.id }});
  res.status(201).json(emp);
});

// update
router.put('/:id', async (req, res) => {
  const orgId = req.user.orgId;
  const id = req.params.id;
  const emp = await Employee.findOne({ where: { id, organisation_id: orgId }});
  if (!emp) return res.status(404).json({ message: 'Not found' });
  await emp.update(req.body);
  await Log.create({ organisation_id: orgId, user_id: req.user.userId, action: 'employee_updated', meta: { employeeId: id }});
  res.json(emp);
});

// delete
router.delete('/:id', async (req, res) => {
  const orgId = req.user.orgId;
  const id = req.params.id;
  await Employee.destroy({ where: { id, organisation_id: orgId }});
  await Log.create({ organisation_id: orgId, user_id: req.user.userId, action: 'employee_deleted', meta: { employeeId: id }});
  res.json({ message: 'deleted' });
});

module.exports = router;

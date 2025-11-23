const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const Team = require('../models/team');
const Employee = require('../models/employee');
const EmployeeTeam = require('../models/employeeTeam');
const Log = require('../models/log');

router.use(authMiddleware);

// list (include employees)
router.get('/', async (req, res) => {
  const orgId = req.user.orgId;
  const teams = await Team.findAll({
    where: { organisation_id: orgId },
    include: [{ model: Employee, through: { attributes: [] } }],
  });
  res.json(teams);
});

// create
router.post('/', async (req, res) => {
  const orgId = req.user.orgId;
  const t = await Team.create({ organisation_id: orgId, name: req.body.name, description: req.body.description });
  await Log.create({ organisation_id: orgId, user_id: req.user.userId, action: 'team_created', meta: { teamId: t.id }});
  res.status(201).json(t);
});

// assign employee
router.post('/:teamId/assign', async (req, res) => {
  const orgId = req.user.orgId;
  const teamId = req.params.teamId;
  const { employeeId } = req.body;
  await EmployeeTeam.create({ employee_id: employeeId, team_id: teamId });
  await Log.create({ organisation_id: orgId, user_id: req.user.userId, action: 'assigned_employee_to_team', meta: { employeeId, teamId }});
  res.json({ ok: true });
});

// unassign
router.delete('/:teamId/unassign', async (req, res) => {
  const orgId = req.user.orgId;
  const teamId = req.params.teamId;
  const { employeeId } = req.body;
  await EmployeeTeam.destroy({ where: { employee_id: employeeId, team_id: teamId }});
  await Log.create({ organisation_id: orgId, user_id: req.user.userId, action: 'unassigned_employee_from_team', meta: { employeeId, teamId }});
  res.json({ ok: true });
});

module.exports = router;

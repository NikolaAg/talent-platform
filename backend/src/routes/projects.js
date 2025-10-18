const express = require('express');
const {
  createProject,
  getProjects,
  getProject,
  applyToProject,
  updateApplicationStatus
} = require('../controllers/projectController');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createProject);
router.get('/', optionalAuth, getProjects);
router.get('/:id', optionalAuth, getProject);
router.post('/:id/apply', auth, applyToProject);
router.put('/applications/:applicationId/status', auth, updateApplicationStatus);

module.exports = router;

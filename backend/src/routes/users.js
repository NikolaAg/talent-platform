const express = require('express');
const {
  getUserProfile,
  searchUsers,
  updateUserSkills,
  addBadge,
  getUserStats
} = require('../controllers/userController');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/search', searchUsers);
router.get('/:userId/profile', getUserProfile);
router.get('/:userId/stats', auth, getUserStats);
router.put('/skills', auth, updateUserSkills);
router.post('/:userId/badges', auth, requireRole(['admin']), addBadge);

module.exports = router;

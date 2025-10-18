const express = require('express');
const {
  createCommunity,
  getCommunities,
  getCommunity,
  joinCommunity,
  leaveCommunity,
  getCommunityMembers
} = require('../controllers/communityController');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createCommunity);
router.get('/', optionalAuth, getCommunities);
router.get('/:id', optionalAuth, getCommunity);
router.post('/:id/join', auth, joinCommunity);
router.post('/:id/leave', auth, leaveCommunity);
router.get('/:id/members', getCommunityMembers);

module.exports = router;

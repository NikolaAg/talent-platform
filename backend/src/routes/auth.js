const express = require('express');
const { 
  register, 
  login, 
  vkAuth, 
  getProfile, 
  updateProfile 
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/vk-auth', vkAuth);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

module.exports = router;

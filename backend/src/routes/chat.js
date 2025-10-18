const express = require('express');
const {
  getConversations,
  getMessages,
  sendMessage
} = require('../controllers/chatController');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/conversations', auth, getConversations);
router.get('/conversations/:conversationId/messages', auth, getMessages);
router.post('/send', auth, sendMessage);

module.exports = router;

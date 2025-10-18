const express = require('express');
const {
  createEvent,
  getEvents,
  getEvent,
  registerForEvent,
  updateEventAttendance
} = require('../controllers/eventController');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, createEvent);
router.get('/', optionalAuth, getEvents);
router.get('/:id', optionalAuth, getEvent);
router.post('/:id/register', auth, registerForEvent);
router.put('/:id/attendance', auth, updateEventAttendance);

module.exports = router;

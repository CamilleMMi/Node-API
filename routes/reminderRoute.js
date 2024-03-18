const express = require('express');
const reminderController = require('../controllers/reminderController');
const authentification = require('../middleware/authentification');

const router = express.Router();

// GETS //

router.get('/', authentification, reminderController.getReminders);
router.get('/:id', authentification, reminderController.getReminderFromId);
router.get('/user/me', authentification, reminderController.getMyReminders);
router.get('/user/:userId', authentification, reminderController.getReminderByUserId);

// POSTS //

router.post('/', authentification, reminderController.createReminder);

// // PUTS //

// router.put('/:id', authentification, reminderController.putReminder);

// // PATCH //

// // DELETES //

// router.delete('/:id', authentification, reminderController.deleteReminder);

module.exports = router;
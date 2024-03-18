const Reminder = require('../models/reminderModel');
const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');
const sms = require('../utils/sms');


// Return all reminders
const getReminders = asyncHandler(async (req, res) => {
    try {
        const reminders = await Reminder.find({});
        res.status(200).json(reminders);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// Get one reminder using its ID
const getReminderFromId = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;

        const reminder = await Reminder.findById(id);

        if (!reminder) {
            res.status(404);
            throw new Error(`Cannot find any reminder with ID ${id}`);
        }

        res.status(200).json(reminder);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// Get all the user's reminders by his ID
const getReminderByUserId = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            res.status(404);
            throw new Error(`Cannot find any user with the id: ${userId}`);
        }

        const userReminders = await Reminder.find({ ownerId: user._id });
        
        res.status(200).json(userReminders);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// Get all user's self reminders
const getMyReminders = asyncHandler(async (req, res) => {
    try {
        const user = req.user;

        const userReminders = await Reminder.find({ ownerId: user._id });
        
        res.status(200).json(userReminders);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

// Create a reminder
const createReminder = asyncHandler(async (req, res) => {
    try {
        const { name, comment, date } = req.body;
        
        let ownerId;
        let user;

        if (req.body.ownerId) {
            ownerId = req.body.ownerId;

            user = await User.findById(ownerId);

            if (!user) {
                res.status(404);
                throw new Error(`Cannot find any user with the id: ${userId}`);
            }
        } else {
            ownerId = req.user._id;
            user = req.user;
        }

        const batch = await sms.sendSms({
            name: name,
            comment: comment,
            date: date,
            user: user,
        })

        const reminderData = {
            name: name,
            comment: comment,
            date: date,
            ownerId: ownerId,
            batchId: batch.id
        };

        const reminder = await Reminder.create(reminderData);

        res.status(201).json(reminder);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
});

module.exports = {
    getReminders,
    getReminderFromId,
    getReminderByUserId,
    getMyReminders,
    createReminder,
};
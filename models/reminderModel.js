const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name of the reminder required"]
        },

        comment: {
            type: String,
        },

        date: {
            type: Date,
            default: Date.now()
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "Owner ID required"]
        },

        batchId: {
            type: String,
            required: [true, "Batch ID required"]
        },

    },

    {
        timestamps: true
    }
)

reminderSchema.methods.toJSON = function() {
    const reminder = this.toObject();

    delete reminder.timestamps;

    return reminder;
}

const Reminder = mongoose.model('Reminder', reminderSchema);

module.exports = Reminder;
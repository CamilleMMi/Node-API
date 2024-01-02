const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
    {
        isDeveloppementData: {
            type: Boolean,
            default: false
        },

        firstName: {
            type: String,
            require: [true, "Name required"],
            default: "John"
        },

        lastName: {
            type: String,
            require: [true, "Last name required"],
            default: "Smith"
        }
    },

    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema);

module.exports = User;
const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema({
    _id: false,

    id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Collection'
    },

    name: {
        type: String,
        required: [true, "Name of the collection required"]
    },
});

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            require: [true, "Name required"],
            default: "John"
        },

        lastName: {
            type: String,
            require: [true, "Last name required"],
            default: "Smith"
        },

        password: {
            type: String,
            require: [true, "Password required"],
            default: "123456"
        },

        iconUri: {
            type: String,
            default: "https://i.pinimg.com/280x280_RS/0d/12/5b/0d125bef05d84ce60294293ad8ad6d26.jpg"
        },

        collections: [collectionSchema]
    },

    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema);

module.exports = User;
const mongoose = require('mongoose');

const passwordSchema = new mongoose.Schema({
    login: {
        type: String,
        required: [true, "Login required"]
    },

    password: {
        type: String,
        required: [true, "Password required"]
    },

    commentaire: {
        type: String
    }
});

const collectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name of the collection required"]
        },

        ownerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, "Owner ID required"]
        },

        sharedWith: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        ],

        passwords: [passwordSchema]
    },

    {
        timestamps: true
    }
);

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;

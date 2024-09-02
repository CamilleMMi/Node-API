const mongoose = require('mongoose');

const userCardSchema = new mongoose.Schema(
    {
        card_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Card',
            required: [true, "Name required"]
        },

        quantity: {
            type: Number,
            min: 1,
            required: [true, "Quantity required"]
        },

        language: {
            type: String,
            enum: ['fr', 'en', 'de', 'it', 'jp'],
            required: [true, "Language required"]
        },

        rarity: {
            type: String,
            enum: ['Common', 'Rare', 'Super Rare', 'Ultra Rare', 'Secret Rare', 'Quarter Century Rare'],
            required: [true, "Rarity Required"]
        },

        condition: {
            type: String,
            enum: ['M', 'NM', 'EX', 'GD', 'LP', 'PL', 'PO'],
            required: [true, "Condition required"]
        },

        edition: {
            type: String,
            enum: ['1st Edition', 'Unlimited Edition', 'Limited Edition'],
            required: [true, "Edition required"]
        },
    },

    {
        timestamps: true
    }
);

const UserCard = mongoose.model('UserCard', userCardSchema);

module.exports = UserCard;
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name required"]
        },

        card_type: {
            type: String,
            enum: ['Monster', 'Spell', 'Trap',],
            required: [true, "Card Type required"]
        },

        sub_type: {
            type: String
        },

        attribute: {
            type: String,
            enum: ['Light', 'Dark', 'Earth', 'Water', 'Fire', 'Wind', 'Divine']
        },

        level: {
            type: Number,
            min: 1,
            max: 12
        },

        atk: {
            type: Number
        },

        def: {
            type: Number
        },

        description: {
            type: String
        },

        set_name: {
            type: String
        },

        set_code: {
            type: String
        },

        rarity: {
            type: String,
            enum: ['Common', 'Rare', 'Super Rare', 'Ultra Rare', 'Secret Rare', 'Quarter Century Rare'],
            required: [true, "Rarity required"]
        },

        image_url: {
            type: String
        },

        release_date: {
            type: Date
        },

        price: {
            type: Number
        },

        languages: [
            {
                type: String,
                enum: ['fr', 'en', 'de', 'it', 'jp']
            }
        ],

        is_limited: {
            type: Boolean,
            default: false
        },

        archetype: {
            type: String
        }
    },

    {
        timestamps: true
    }
);

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
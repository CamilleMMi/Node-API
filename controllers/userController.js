const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// Return all users
const getUsers = asyncHandler(async(req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// Get one user using his ID
const getUserFromId = asyncHandler(async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        
        if (!user) {
            res.status(404);
            throw new Error(`Cannot find any user with ID ${id}`);
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// Create a user
const createUser = asyncHandler(async(req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(200).json(user)
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// Put a user using his ID
const putUser = asyncHandler(async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body);
        
        if(!user) {
            res.status(404)
            throw new Error(`Cannot find any user with the id: ${id}`);
        }

        res.status(200).json({user});
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// Delete a user using his ID
const deleteUser = asyncHandler(async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if(!user) {
            res.status(404)
            throw new Error(`Cannot find any user with the id: ${id}`);
        }

        res.status(200).send();
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

module.exports = {
    getUsers,
    getUserFromId,
    createUser,
    putUser,
    deleteUser
}
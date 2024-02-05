const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// Let the user log into Fiddle
const login = asyncHandler(async(req, res) => {
    try {
        const user = await User.login(req.body.email, req.body.password);
        const authToken = await user.generateAuthTokenAndSaveUser();

        res.send({ user, authToken });
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// Logout a user from his current device
const logout = asyncHandler(async(req, res) => {
    try {
        req.user.authTokens = req.user.authTokens.filter((authToken) => {
            return authToken.authToken !== req.authToken;
        })

        await req.user.save();

        res.send();
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// Logout a user from every device
const logoutAll = asyncHandler(async(req, res) => {
    try {
        req.user.authTokens = [];

        await req.user.save();

        res.send();
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

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
            throw new Error(`Cannot find any user with ID: ${id}`);
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// Create a user
// TODO CREATE + LOGIN
const createUser = asyncHandler(async(req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(200).json(user);
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

// Put a user using his ID
const putUser = asyncHandler(async(req, res) => {
    try {
        const { id } = req.params;
        const updatedInfo = Object.keys(req.body);

        const user = await User.findById(id);
        
        if(!user) {
            res.status(404)
            throw new Error(`Cannot find any user with ID: ${id}`);
        }

        updatedInfo.forEach(field => user[field] = req.body[field]);

        console.log(user);

        await user.save(
            { new: true }
        );

        res.status(200).json({ user });
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
            throw new Error(`Cannot find any user with ID: ${id}`);
        }

        res.status(200).send();
    } catch (error) {
        res.status(500);
        throw new Error(error.message);
    }
})

module.exports = {
    login,
    logout,
    logoutAll,
    getUsers,
    getUserFromId,
    createUser,
    putUser,
    deleteUser
}
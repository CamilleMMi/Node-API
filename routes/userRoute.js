const express = require('express');
const User = require('../models/userModel');
const userController = require('../controllers/userController');

const router = express.Router();

// GETS //

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserFromId);

// POSTS //

router.post('/', userController.createUser);

// PUTS //

router.put('/:id', userController.putUser);

// DELETES //

router.delete('/:id', userController.deleteUser);

module.exports = router;
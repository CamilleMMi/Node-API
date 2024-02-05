const express = require('express');
const userController = require('../controllers/userController');
const authentification = require('../middleware/authentification');

const router = express.Router();

// GETS //

router.get('/', authentification, userController.getUsers);
router.get('/:id', authentification, userController.getUserFromId);

// POSTS //

router.post('/', userController.createUser);
router.post('/login', userController.login);
router.post('/logout', authentification, userController.logout);
router.post('/logout/all', authentification, userController.logoutAll);

// PUTS //

router.put('/:id', authentification, userController.putUser);

// DELETES //

router.delete('/:id', authentification, userController.deleteUser);

module.exports = router;
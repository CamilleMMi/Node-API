const express = require('express');
const playgroundController = require('../controllers/playgroundController');

router = express.Router();

// Routes for development

router.get('/error', playgroundController.errorPlayground);

module.exports = router;
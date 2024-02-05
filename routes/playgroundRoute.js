const express = require('express');
const playgroundController = require('../controllers/playgroundController');
const { encryptData, decryptData } = require('../utils/encryption');

const router = express.Router();

// Routes for development

router.get('/error', playgroundController.errorPlayground);

router.post('/encrypt', (req, res) => {
    const { data } = req.body;
    const encryptedData = encryptData(data);
    
    res.json({ encryptedData });
})

router.post('/decrypt', (req, res) => {
    const { encryptedData } = req.body;
    const data = decryptData(encryptedData);

    res.json({ data });
})

module.exports = router;
const express = require('express');
const router = express.Router();
const path = require('path');
const loginController = require('../controllers/login');


router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.post('/login', loginController.loginCheck);

module.exports = router;
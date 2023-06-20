const express = require('express');
const router = express.Router();
const path = require('path');
const loginController = require('../controllers/login');


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/login.html'));
});

router.post('/', loginController.loginCheck, (req, res, next) => {
    redirect('/expense');
    next();
});

module.exports = router;
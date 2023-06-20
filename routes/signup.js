const express = require('express');
const router = express.Router();
const path = require('path');
const signUpController = require('../controllers/signup');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/signup.html'));
});

// User sign up
router.post('/', signUpController.addUser, (req, res, next) => {
    res.redirect('/expense');
    next();
});

module.exports = router;
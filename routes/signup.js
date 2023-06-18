const express = require('express');
const router = express.Router();
const path = require('path');
const signUpController = require('../controllers/signup');

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/signup.html'));
});

// User sign up
router.post('/signup', signUpController.createUser, (req, res) => {
    res.redirect('/');
});

module.exports = router;
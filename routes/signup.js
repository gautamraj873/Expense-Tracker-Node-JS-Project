const express = require('express');
const router = express.Router();
const signUpController = require('../controllers/signup');

// Create a new user sign up
router.post('/add-user', signUpController.createUser);

module.exports = router;
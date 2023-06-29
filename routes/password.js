const express = require('express');
const router = express.Router();
const path = require('path');
const passwordController = require('../controllers/password');


router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/password.html'));
});

router.post('/forgotPassword', passwordController.forgotPassword);

router.get('/resetPassword/:id', passwordController.resetPassword);

router.post('/updatePassword/:resetPasswordId', passwordController.updatePassword);

module.exports = router;
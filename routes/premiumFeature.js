const express = require('express');
const router = express.Router();
const premiumFeatureController = require('../controllers/premiumFeature');
const userAuthentication = require('../middleware/user_auth');

router.get('/showLeaderBoard', userAuthentication.authenticateToken, premiumFeatureController.getUserLeaderBoard);

module.exports = router;
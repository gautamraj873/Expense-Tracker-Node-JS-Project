const express = require('express');
const router = express.Router();

const purchaseController = require('../controllers/purchase');

const userAuthentication = require('../middleware/user_auth');

router.get('/premiumMembership', userAuthentication.authenticateToken, purchaseController.purchasePremium);

router.post('/updateTransactionStatus', userAuthentication.authenticateToken, purchaseController.updateTransactionStatus);

module.exports = router;
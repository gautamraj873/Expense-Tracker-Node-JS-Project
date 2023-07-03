const express = require('express');
const router = express.Router();

const purchaseMembershipController = require('../controllers/purchaseMembership');

const userAuthentication = require('../middleware/auth');

router.get('/premiumMembership', userAuthentication.authenticate, purchaseMembershipController.purchasePremium);

router.post('/updateTransactionStatus', userAuthentication.authenticate, purchaseMembershipController.updateTransactionStatus);

module.exports = router;
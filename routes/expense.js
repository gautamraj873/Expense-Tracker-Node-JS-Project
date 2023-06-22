const express = require('express');
const router = express.Router();
const path = require('path');
const expenseController = require('../controllers/expense');
const userAuthentication = require('../middleware/user_auth');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/expense.html'));
});

router.get('/data', userAuthentication.authenticateToken, expenseController.getExpense);

router.post('/data', userAuthentication.authenticateToken, expenseController.addExpense);

router.delete('/delete/:id', userAuthentication.authenticateToken, expenseController.deleteExpense);

module.exports = router;
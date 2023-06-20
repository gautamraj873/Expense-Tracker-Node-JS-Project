const express = require('express');
const router = express.Router();
const path = require('path');
const expenseController = require('../controllers/expense');

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/expense.html'));
});

router.get('/add-expense', expenseController.getExpense);

router.post('/add-expense', expenseController.addExpense);

router.delete(`/add-expense/:id`, expenseController.deleteExpense);

module.exports = router;
const express = require('express');
const router = express.Router();
const path = require('path');
const expenseController = require('../controllers/expense');
const userAuthentication = require('../middleware/auth');

router.get("/", expenseController.getHomePage);

router.get("/getAllExpenses", userAuthentication.authenticate, expenseController.getAllExpenses);

router.get("/getAllExpenses/:page", userAuthentication.authenticate, expenseController.getAllExpensesforPagination);

router.get("/deleteExpense/:id", userAuthentication.authenticate, expenseController.deleteExpense);

router.post("/addExpense", userAuthentication.authenticate, expenseController.addExpense);

router.post("/editExpense/:id", userAuthentication.authenticate, expenseController.editExpense);

router.get('/download', userAuthentication.authenticate, expenseController.downloadExpense);

module.exports = router;

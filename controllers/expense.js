const Expense = require('../models/expense');

exports.getExpense = async (req, res) => {
    try{
        const expenseData = await Expense.findAll({ where: {userId: req.user.id}});
        res.json(expenseData);
    }
    catch (error) {
        res.status(500).json({error: 'Failed to fetch expenses'});
    }
};

exports.addExpense = async (req, res) => {
    const amount = req.body.amount;
    const category = req.body.category;
    const description = req.body.description;
    const date = req.body.date;
    try{
        const expenseData = await Expense.create({
            amount: amount,
            category: category,
            description: description,
            date: date,
            userId: req.user.id
        })
        res.status(201).json({ expense: expenseData });
    }
    catch (error) {
        res.status(400).json({error: 'Failed to create expenses'});
    }
};

exports.deleteExpense = async (req, res) => {
    const expenseId = req.params.id;
    try{
        const expense = await Expense.findByPk(expenseId);
        if (!expense) {
          return res.status(404).json({ error: 'Expense not found' });
        }
    
        await expense.destroy({where: {id: expenseId, userId: req.user.id}});
        res.status(200).json({ message: 'Expense deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete expense' });
    }
};
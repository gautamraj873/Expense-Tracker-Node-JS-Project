const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

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
    const t = await sequelize.transaction();
    const { amount, category, description, date } = req.body;
    
    try {
      const expense = await Expense.create(
        { amount, category, description, date, userId: req.user.id },
        { transaction: t }
      );
      
      const totalExpense = Number(req.user.totalExpenses) + Number(amount);
      
      await User.update(
        { totalExpenses: totalExpense },
        { where: { id: req.user.id }, transaction: t }
      );
      
      await t.commit();
      
      res.status(200).json({ expense: expense });
    } catch (error) {
      await t.rollback();
      console.log(error);
      res.status(400).json({ error: 'Failed to create expenses' });
    }
  };
  

exports.deleteExpense = async (req, res) => {
    const expenseId = req.params.id;
    const t = await sequelize.transaction();
    try{
        const expense = await Expense.findOne({ where: {id: expenseId, userId: req.user.id}, transaction: t});
        if (!expense) {
          await t.rollback();
          return res.status(404).json({ error: 'Expense not found' });
        }
    
        await expense.destroy({ where: {id: expenseId, userId: req.user.id} , transaction: t});
        const totalExpense = Number(req.user.totalExpenses) - Number(expense.amount);
        await User.update(
          {totalExpenses: totalExpense},
          {where: {id: req.user.id}, transaction: t}
        )
        await t.commit();
        res.status(200).json({ message: 'Expense deleted successfully' });
    }
    catch (error) {
      await t.rollback();
      console.log(error);
      res.status(500).json({ error: 'Failed to delete expense' });
    }
};
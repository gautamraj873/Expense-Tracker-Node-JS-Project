const User = require('../models/user');
const Expense = require('../models/expense');

exports.getUserLeaderBoard = async (req, res) => {
    try {
        const users = await User.findAll();
        const expenses = await Expense.findAll();
        const userAggregatedExpenses = {}
        expenses.forEach((expense) => {
            if(userAggregatedExpenses[expense.userId]){
                userAggregatedExpenses[expense.userId] = userAggregatedExpenses[expense.userId] + expense.amount;
            }
            else{
                userAggregatedExpenses[expense.userId] = expense.amount;
            }
        })
        var UserLeaderBoardDetails =[];
        users.forEach((user) => {
            UserLeaderBoardDetails.push({name: user.name, total_cost: userAggregatedExpenses[user.id] || 0})
        })
        res.status(200).json(UserLeaderBoardDetails);
        UserLeaderBoardDetails.sort((a, b) => b.total_cost - a.total_cost);
    } catch (error) {
        res.status(500).json(error);
    }
};
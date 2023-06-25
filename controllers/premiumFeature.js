const User = require('../models/user');
const Expense = require('../models/expense');
const sequelize = require('../util/database');

exports.getUserLeaderBoard = async (req, res) => {
    try {
        const leaderboardOfUsers = await User.findAll({
            attributes: [
                'id', 
                'name', 
                [sequelize.fn('SUM', sequelize.col('expenses.amount')), 'total_cost']
            ],
            include: [
                {
                    model: Expense,
                    attributes: []
                }
            ],
            group: ['User.id'],
            order: [['total_cost', 'DESC']]
        })
        res.status(200).json(leaderboardOfUsers);
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};
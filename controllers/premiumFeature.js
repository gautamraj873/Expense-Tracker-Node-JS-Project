const User = require('../models/user');

exports.getUserLeaderBoard = async (req, res) => {
    try {
        const leaderboardOfUsers = await User.findAll({
            order: [['totalExpenses', 'DESC']]
        })
        res.status(200).json(leaderboardOfUsers);
    }
    catch (error) {
        res.status(500).json(error);
    }
};
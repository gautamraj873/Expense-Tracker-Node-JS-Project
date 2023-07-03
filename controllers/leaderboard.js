const path = require("path");
const User = require("../models/user");
const Expense = require("../models/expense");
const sequelize = require("../util/database");

exports.getLeaderboardPage = async (req, res, next) => {
  try {
    res.sendFile(
      path.join(__dirname, "../", "public", "views", "leaderboard.html")
    );
  } catch {
    (err) => console.log(err);
  }
};
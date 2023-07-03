const express = require('express');
const router = express.Router();
const path = require('path');

const leaderboardController = require("../controllers/leaderboard");

router.get("/getLeaderboardPage", leaderboardController.getLeaderboardPage);

module.exports = router;
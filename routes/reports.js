const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reports");
const userAuthentication = require("../middleware/auth");

router.get("/getReportsPage", reportsController.getReportsPage);
router.post("/dailyReports", userAuthentication.authenticate, reportsController.dailyReports);
router.post("/monthlyReports", userAuthentication.authenticate, reportsController.monthlyReports);

module.exports = router;
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");
const userAuthentication = require("../middleware/auth");

router.get("/", userController.getLoginPage);
router.get("/isPremiumUser", userAuthentication.authenticate, userController.isPremiumUser);
router.get("/getAllUsers", userController.getAllUsers);
router.post("/login", userController.postUserLogin);
router.post("/signUp", userController.postUserSignUp);

module.exports = router;
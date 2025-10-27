const express = require('express');
const UserController =require('../controllers/user.controller');
const OTPcontroller = require('../controllers/otp.controller');
const router = express.Router();

router.post("/sendotp", OTPcontroller.sendOTP);
router.post("/verifyotp", OTPcontroller.verifyOTP);
router.post("/resendotp", OTPcontroller.resendOTP);
router.post("/verifyuser", UserController.verifyUseralreadyexist);
router.post("/createwaitinguser", UserController.createWaitingUser);
router.get("/waitingusers", UserController.getAllWaitingUsers);
router.post("/approveuser/:id", UserController.approveWaitingUser);
router.post("/login", UserController.loginUser);
router.get("/deletewaitinguser/:id", UserController.deleteWaitingUser);


module.exports = router;
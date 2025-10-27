const User = require("../models/user.model");
const waitinguser = require("../models/waitinguser.model");
const otpService = require("../util/otpservice.js"); 

exports.verifyUseralreadyexist = async (req, res) => {
  console.log("Verifying user existence with data:", req.body);
  try {
    let { email, uid, phone } = req.body;
    if (!email || !uid || !phone) {
      return res.status(400).json({ message: "Email, UID, and Phone are required" });
    }

    email = email.trim().toLowerCase();
    uid = uid.trim().toLowerCase();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { uid }, { phone }]
    });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists", flag: "true" });
    }

    // Check waiting users
    const existingWaitingUser = await waitinguser.findOne({
      $or: [{ email }, { uid }, { phone }]
    });
    if (existingWaitingUser) {
      return res.status(409).json({ message: "User already in waiting list", flag: "false" });
    }

    // Send OTP directly via otpService
    const result = await otpService.generateAndSendOTP(email);
    if (!result.success) {
      return res.status(500).json({ message: result.message });
    }

    // Return OTP sent success
    res.status(200).json({ message: "User does not exist. OTP sent successfully." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


exports.createWaitingUser = async (req, res) => {
  try {
    const { name, email, uid, phone, password, className } = req.body;
    if (!name || !email || !uid || !phone || !password || !className) {
      return res.status(400).json({ message: "All fields including className are required" });
    }

    const newWaitingUser = new waitinguser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      uid: uid.trim().toLowerCase(),
      phone,
      password,
      className
    });

    await newWaitingUser.save();
    res.status(201).json({ message: "Waiting user created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// Get all waiting users (for admin)
exports.getAllWaitingUsers = async (req, res) => {
  try {
    const users = await waitinguser.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
exports.approveWaitingUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToApprove = await waitinguser.findById(id);
    if (!userToApprove) {
      return res.status(404).json({ message: "Waiting user not found" });
    }

    const newUser = new User({
      name: userToApprove.name,
      email: userToApprove.email,
      uid: userToApprove.uid,
      phone: userToApprove.phone,
      password: userToApprove.password,
      className: userToApprove.className, // <-- added
      role: 'user'
    });

    await newUser.save();
    await waitinguser.deleteOne({ _id: id });
    res.status(200).json({ message: "Waiting user approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete waiting user (for admin)
exports.deleteWaitingUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToDelete = await waitinguser.findById(id);
    if (!userToDelete) {
      return res.status(404).json({ message: "Waiting user not found" });
    }
    await waitinguser.deleteOne({ _id: id });
    res.status(200).json({ message: "Waiting user deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { uid, password } = req.body;
    console.log(req.body);
    if (!uid || !password) {
      return res.status(400).json({ message: "UID and password are required" });
    }
    const waitingUser = await waitinguser.findOne({ uid: uid.trim().toLowerCase() });
    if (waitingUser) {
      return res.status(403).json({ message: "User is still in waiting list" });
    }
    const user = await User.findOne({ uid: uid.trim().toLowerCase() });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid UID or password" });
    }
    res.status(200).json({ 
  message: "Login successful", 
  user: { 
    id: user._id, 
    name: user.name, 
    email: user.email, 
    uid: user.uid, 
    phone: user.phone, 
    role: user.role,
    className: user.className // <-- include className if needed in frontend
  } 
});

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
const otpService = require("../util/otpservice");
const waitinguser = require("../models/waitinguser.model");

// Send OTP
exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const result = await otpService.generateAndSendOTP(email);
  if (!result.success) return res.status(500).json({ message: result.message });

  res.status(200).json({ message: result.message });
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  const { email, otp, name, uid, phone, password, className } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

  // Verify OTP
  const result = await otpService.verifyOTP(email, otp);
  if (!result.success) return res.status(400).json({ message: result.message });

  // Check if waiting user already exists
  const existingWaitingUser = await waitinguser.findOne({ email: email.toLowerCase().trim() });
  if (existingWaitingUser) {
    return res.status(200).json({ message: "OTP verified. Waiting user already exists." });
  }

  // Create new waiting user
  const newWaitingUser = new waitinguser({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    uid: uid.trim().toLowerCase(),
    phone,
    password, // stored as plain text
    className: className.trim()
  });

  await newWaitingUser.save();

  res.status(200).json({ message: "OTP verified. Waiting user created successfully." });
};

// Resend OTP (same as sendOTP)
exports.resendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const result = await otpService.generateAndSendOTP(email);
    if (!result.success) return res.status(500).json({ message: result.message });

    res.status(200).json({ message: "OTP resent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
};

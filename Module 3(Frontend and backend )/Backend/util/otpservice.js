const OTP = require("../models/otp.model");
const sendEmail = require("./sendEmail");

/**
 * Generate, send, and store OTP for an email.
 * @param {string} email
 * @returns {Object} { success: boolean, message: string, otp?: string }
 */
async function generateAndSendOTP(email) {
  try {
    email = email.trim().toLowerCase();

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Send email
    const sent = await sendEmail(email, "Your OTP", `<p>Your OTP is: <strong>${otp}</strong></p>`);
    if (!sent) return { success: false, message: "Failed to send OTP email" };

    // Save or update OTP in DB
    const existingOtp = await OTP.findOne({ email });
    if (existingOtp) {
      existingOtp.otp = otp;
      existingOtp.createdAt = new Date();
      await existingOtp.save();
    } else {
      await new OTP({ email, otp }).save();
    }

    return { success: true, message: "OTP sent successfully", otp };
  } catch (error) {
    console.error("Error in OTP service:", error);
    return { success: false, message: "Internal server error" };
  }
}

/**
 * Verify OTP for an email.
 * @param {string} email
 * @param {string} otp
 * @returns {Object} { success: boolean, message: string }
 */
async function verifyOTP(email, otp) {
  try {
    email = email.trim().toLowerCase();

    const otpEntry = await OTP.findOne({ email });
    if (!otpEntry) return { success: false, message: "OTP not found or expired" };

    if (otpEntry.otp !== otp) return { success: false, message: "Invalid OTP" };

    // OTP verified → delete it
    await OTP.deleteOne({ email });

    return { success: true, message: "OTP verified successfully" };
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, message: "Internal server error" };
  }
}

module.exports = { generateAndSendOTP, verifyOTP };

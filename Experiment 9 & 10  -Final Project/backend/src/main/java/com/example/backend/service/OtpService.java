package com.example.backend.service;

import com.example.backend.model.Otp;
import com.example.backend.repository.OtpRepository;
import com.example.backend.util.EmailUtil;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.Random;

@Service
public class OtpService {

    private final OtpRepository otpRepository;
    private final EmailUtil emailUtil;

    public OtpService(OtpRepository otpRepository, EmailUtil emailUtil) {
        this.otpRepository = otpRepository;
        this.emailUtil = emailUtil;
    }

    // Generate, send, and store OTP
    public String generateAndSendOTP(String email) {
        try {
            email = email.trim().toLowerCase();

            // Generate 6-digit OTP
            String otp = String.valueOf(100000 + new Random().nextInt(900000));

            // Send email
            boolean sent = emailUtil.sendEmail(email, "Your OTP",
                    "<p>Your OTP is: <strong>" + otp + "</strong></p>");
            if (!sent) return "Failed to send OTP email";

            // Save or update OTP
            Optional<Otp> existingOtp = otpRepository.findByEmail(email);
            if (existingOtp.isPresent()) {
                Otp otpDoc = existingOtp.get();
                otpDoc.setOtp(otp);
                otpDoc.setCreatedAt(new Date());
                otpRepository.save(otpDoc);
            } else {
                Otp newOtp = new Otp(email, otp);
                otpRepository.save(newOtp);
            }

            return "OTP sent successfully";
        } catch (Exception e) {
            e.printStackTrace();
            return "Internal server error";
        }
    }

    // Verify OTP
    public String verifyOTP(String email, String otp) {
        try {
            email = email.trim().toLowerCase();

            Optional<Otp> otpEntry = otpRepository.findByEmail(email);
            if (otpEntry.isEmpty()) return "OTP not found or expired";

            if (!otpEntry.get().getOtp().equals(otp)) return "Invalid OTP";

            otpRepository.deleteByEmail(email);
            return "OTP verified successfully";

        } catch (Exception e) {
            e.printStackTrace();
            return "Internal server error";
        }
    }
}

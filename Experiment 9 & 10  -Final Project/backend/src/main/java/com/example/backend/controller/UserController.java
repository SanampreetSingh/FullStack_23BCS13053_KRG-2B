package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.model.WaitingUser;
import com.example.backend.service.UserService;
import com.example.backend.service.OtpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final OtpService otpService;

    public UserController(UserService userService, OtpService otpService) {
        this.userService = userService;
        this.otpService = otpService;
    }

    // Verify if user exists and send OTP
    @PostMapping("/verifyuser")
    public ResponseEntity<?> verifyUser(@RequestBody User user) {
        String message = userService.verifyUserExistence(user.getEmail(), user.getUid(), user.getPhone());
        if (message.startsWith("OTP")) return ResponseEntity.ok().body(message);
        return ResponseEntity.status(409).body(message);
    }

    // Create Waiting User
    @PostMapping("/createwaitinguser")
    public ResponseEntity<?> createWaitingUser(@RequestBody WaitingUser user) {
        WaitingUser saved = userService.createWaitingUser(user);
        return ResponseEntity.status(201).body(saved);
    }

    // Get all waiting users
    @GetMapping("/waitingusers")
    public ResponseEntity<List<WaitingUser>> getAllWaitingUsers() {
        return ResponseEntity.ok(userService.getAllWaitingUsers());
    }

    // Approve waiting user
    @PostMapping("/approveuser/{id}")
    public ResponseEntity<String> approveWaitingUser(@PathVariable String id) {
        String result = userService.approveWaitingUser(id);
        if (result.contains("successfully")) return ResponseEntity.ok(result);
        return ResponseEntity.badRequest().body(result);
    }

    // Delete waiting user
    @DeleteMapping("/deletewaitinguser/{id}")
    public ResponseEntity<String> deleteWaitingUser(@PathVariable String id) {
        String result = userService.deleteWaitingUser(id);
        if (result.contains("successfully")) return ResponseEntity.ok(result);
        return ResponseEntity.badRequest().body(result);
    }

    // Login
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User loginRequest) {
        Optional<User> user = userService.loginUser(loginRequest.getUid(), loginRequest.getPassword());
        if (user.isPresent()) return ResponseEntity.ok(user.get());
        return ResponseEntity.status(401).body("Invalid UID or password / User in waiting list");
    }

    // OTP endpoints
    @PostMapping("/sendotp")
    public ResponseEntity<String> sendOtp(@RequestBody User request) {
        String result = otpService.generateAndSendOTP(request.getEmail());
        return ResponseEntity.ok(result);
    }

    @PostMapping("/verifyotp")
    public ResponseEntity<String> verifyOtp(@RequestBody User request) {
        String result = otpService.verifyOTP(request.getEmail(), request.getPassword()); // use password field as OTP
        return ResponseEntity.ok(result);
    }

    @PostMapping("/resendotp")
    public ResponseEntity<String> resendOtp(@RequestBody User request) {
        String result = otpService.generateAndSendOTP(request.getEmail());
        return ResponseEntity.ok(result);
    }
}

package com.example.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.backend.model.ClassModel;
import com.example.backend.model.User;
import com.example.backend.model.WaitingUser;
import com.example.backend.repository.ClassRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.WaitingUserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final WaitingUserRepository waitingUserRepository;
    private final ClassRepository classRepository;
    private final OtpService otpService;

    public UserService(UserRepository userRepository,
                       WaitingUserRepository waitingUserRepository,
                       ClassRepository classRepository,
                       OtpService otpService) {
        this.userRepository = userRepository;
        this.waitingUserRepository = waitingUserRepository;
        this.classRepository = classRepository;
        this.otpService = otpService;
    }

    // Verify if user already exists
    public String verifyUserExistence(String email, String uid, Long phone) {
        if (!StringUtils.hasText(email) || !StringUtils.hasText(uid) || phone == null) {
            return "Missing required fields";
        }

        email = email.trim().toLowerCase();
        uid = uid.trim().toLowerCase();

        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) return "User already exists";

        existingUser = userRepository.findByUid(uid);
        if (existingUser.isPresent()) return "User already exists";

        existingUser = userRepository.findByPhone(phone);
        if (existingUser.isPresent()) return "User already exists";

        Optional<WaitingUser> existingWaitingUser = waitingUserRepository.findByEmail(email);
        if (existingWaitingUser.isPresent()) return "User already in waiting list";

        existingWaitingUser = waitingUserRepository.findByUid(uid);
        if (existingWaitingUser.isPresent()) return "User already in waiting list";

        existingWaitingUser = waitingUserRepository.findByEmail(email);
        if (existingWaitingUser.isPresent()) return "User already in waiting list";

        // Send OTP
        return otpService.generateAndSendOTP(email);
    }

    // Create Waiting User
    public WaitingUser createWaitingUser(WaitingUser user) {
        return waitingUserRepository.save(user);
    }

    // Get all waiting users
    public List<WaitingUser> getAllWaitingUsers() {
        return waitingUserRepository.findAll();
    }

    // Approve waiting user
    public String approveWaitingUser(String id) {
        try {
            Optional<WaitingUser> optionalWaitingUser = waitingUserRepository.findById(id);
            if (optionalWaitingUser.isEmpty()) return "Waiting user not found";

            WaitingUser waitingUser = optionalWaitingUser.get();
            ClassModel classModel = classRepository.findByClassName(waitingUser.getClassName());
            if (classModel == null) {
                waitingUserRepository.deleteById(id);
                return "Class not found. Waiting user removed.";
            }

            // Ensure students list is initialized to avoid NPE
            if (classModel.getStudents() == null) {
                classModel.setStudents(new java.util.ArrayList<>());
            }

            // Add student to class
            ClassModel.Student student = new ClassModel.Student(waitingUser.getUid(), waitingUser.getName());
            classModel.getStudents().add(student);
            classRepository.save(classModel);

            // Create real user
            User user = new User();
            user.setName(waitingUser.getName());
            user.setEmail(waitingUser.getEmail());
            user.setUid(waitingUser.getUid());
            user.setPhone(waitingUser.getPhone());
            user.setPassword(waitingUser.getPassword());
            user.setClassName(waitingUser.getClassName());
            user.setRole("user");
            userRepository.save(user);

            waitingUserRepository.deleteById(id);
            return "Waiting user approved successfully";
        } catch (Exception e) {
            // Log and return a readable message instead of letting exception cause 500 with no detail
            e.printStackTrace();
            return "Error approving waiting user: " + e.getMessage();
        }
    }

    // Delete waiting user
    public String deleteWaitingUser(String id) {
        Optional<WaitingUser> optionalWaitingUser = waitingUserRepository.findById(id);
        if (optionalWaitingUser.isEmpty()) return "Waiting user not found";

        waitingUserRepository.deleteById(id);
        return "Waiting user deleted successfully";
    }

    // Login user
   // Login user
public Optional<User> loginUser(String uid, String password) {
    System.out.println("Received login attempt:");
    System.out.println("UID: '" + uid + "'");
    System.out.println("Password: '" + password + "'");

    if (!StringUtils.hasText(uid) || !StringUtils.hasText(password)) {
        System.out.println("Missing UID or password");
        return Optional.empty();
    }

    Optional<WaitingUser> waitingUser = waitingUserRepository.findByUid(uid.trim().toLowerCase());
    if (waitingUser.isPresent()) {
        System.out.println("User is still in waiting list");
        return Optional.empty(); // Still in waiting list
    }

    Optional<User> user = userRepository.findByUid(uid.trim().toLowerCase());
    if (user.isPresent()) {
        System.out.println("User found in DB: " + user.get().getUid());
        System.out.println("Stored password: '" + user.get().getPassword() + "'");
        if (password.equals(user.get().getPassword())) {
            System.out.println("Password matches! Login success");
            return user;
        } else {
            System.out.println("Password does not match!");
        }
    } else {
        System.out.println("No user found with UID: " + uid);
    }

    return Optional.empty();
}}

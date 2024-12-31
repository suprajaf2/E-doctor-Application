package com.infosys.eDoctor.controller;

import com.infosys.eDoctor.entity.Users;
import com.infosys.eDoctor.repository.UsersRepo;
import com.infosys.eDoctor.request.LoginRequest;
import com.infosys.eDoctor.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
public class UsersController {

    @Autowired
    UserService userService;

    @Autowired
    UsersRepo usersRepo;

    @PostMapping("/addUser")
    @CrossOrigin(origins = "http://localhost:3000")
    public Users addUser(@RequestBody Users user) {
        if (user.getUserType() == null || user.getUserType().isEmpty()) {
            user.setUserType("patient");
        }
        return userService.addUser(user);
    }

    @PostMapping("/loginUser")
    @CrossOrigin(origins = "http://localhost:3000")
    public Boolean loginUser(@RequestBody LoginRequest loginRequest) {
        return userService.loginUser(loginRequest);
    }


    @PostMapping("/forgot-password")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<String> forgotPassword(@RequestParam String email) {
        userService.initiatePasswordReset(email);  // Sends OTP to the user's email
        return ResponseEntity.ok("If the email exists, an OTP has been sent.");
    }

    @PostMapping("/reset-password")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<String> resetPassword(@RequestParam String otp, @RequestParam String newPassword) {
        Users user = usersRepo.findByResetToken(otp)
                .orElseThrow(() -> new RuntimeException("Invalid or expired OTP"));

        // Check if the OTP has expired
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("OTP expired");
        }

        // Reset the user's password
        user.setPassword(new BCryptPasswordEncoder().encode(newPassword));

        // Clear the OTP and expiry fields
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        usersRepo.save(user);

        return ResponseEntity.ok("Password reset successful");
    }



}
package com.infosys.eDoctor.service;

import com.infosys.eDoctor.entity.Users;
import com.infosys.eDoctor.repository.UsersRepo;
import com.infosys.eDoctor.request.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UsersRepo usersRepo;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;


    @Autowired
    JavaMailSender mailSender;

    public Users addUser(Users user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return usersRepo.save(user);
    }

    public Boolean loginUser(LoginRequest loginRequest) {
        Optional<Users> userOptional = usersRepo.findByEmail(loginRequest.getUserId());

        if (userOptional.isEmpty()) return false;

        Users user = userOptional.get();
        return passwordEncoder.matches(loginRequest.getPassword(), user.getPassword()) &&
                user.getUserType().equals(loginRequest.getUserType());
    }

    public void initiatePasswordReset(String email) {
        Users users = usersRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("Email not found!"));

        // Generate a 6-digit OTP
        String otp = generateOtp();

        // Store the OTP and expiry time (expires in 10 minutes)
        users.setResetToken(otp);
        users.setResetTokenExpiry(LocalDateTime.now().plusMinutes(10)); // Expires in 10 minutes
        usersRepo.save(users);

        // Prepare the email content
        String subject = "Password Reset OTP";
        String body = "Use the following OTP to reset your password: " + otp + "\nThis OTP will expire in 10 minutes.";
        sendEmail(users.getEmail(), subject, body);
    }

    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public String generateOtp() {
        // Generate a random 6-digit OTP
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000); // 6-digit OTP
        return String.valueOf(otp);
    }

}

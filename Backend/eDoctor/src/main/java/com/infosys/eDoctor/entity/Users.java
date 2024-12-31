package com.infosys.eDoctor.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;

import java.time.LocalDateTime;

@Entity
public class Users {

    @Id
    private String email; // Primary key
    private String name;
    private String password; // Common for all user types
    private String userType; // Determines if the user is a Doctor or other type

    private String resetToken; // To store the token
    private LocalDateTime resetTokenExpiry;

    @OneToOne(mappedBy = "users", cascade = CascadeType.ALL)
    private Doctor doctor;

    @OneToOne(mappedBy = "users2", cascade = CascadeType.ALL)
    private Patient patient;

    public Users() {}

    public Users(String email, String name, String password, String userType) {
        this.email = email;
        this.name = name;
        this.password = password;
        this.userType = userType;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }

    public LocalDateTime getResetTokenExpiry() {
        return resetTokenExpiry;
    }

    public void setResetTokenExpiry(LocalDateTime resetTokenExpiry) {
        this.resetTokenExpiry = resetTokenExpiry;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }
}

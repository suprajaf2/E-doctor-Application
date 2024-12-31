package com.infosys.eDoctor.service;

import com.infosys.eDoctor.config.AdminProperties;
import com.infosys.eDoctor.entity.Admin;
import com.infosys.eDoctor.entity.Doctor;
import com.infosys.eDoctor.entity.Patient;
import com.infosys.eDoctor.repository.AdminRepo;
import com.infosys.eDoctor.repository.DoctorRepo;
import com.infosys.eDoctor.repository.FeedbackRepo;
import com.infosys.eDoctor.repository.PatientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
public class AdminService {
    @Autowired
    AdminRepo adminRepo;
    @Autowired
    DoctorRepo doctorRepo;
    @Autowired
    PatientRepo patientRepo;
    @Autowired
    FeedbackRepo feedbackRepo;
    @Autowired
    private AdminProperties adminProperties;

    public boolean authenticateAdmin(String adminname, String password) {
        // Compare provided credentials with the default ones
        return adminname.equals(adminProperties.getUsername()) &&
                password.equals(adminProperties.getPassword());
    }

    public long getTotalDoctors() {
        return doctorRepo.count();
    }

    public long getTotalPatients() {
        return patientRepo.count();
    }

    public long getTotalFeedbacks() {
        return feedbackRepo.count();
    }

    public long getTotalUsers() {
        return getTotalDoctors() + getTotalPatients();
    }

    //for adding the admin
    public void saveAdmin(Admin admin) {
        adminRepo.save(admin);
    }

    public void saveDefaultAdmin() {
        // Save the default admin to the database if needed
        Admin defaultAdmin = new Admin(adminProperties.getUsername(), adminProperties.getPassword());
        // Logic to save the admin in the repository
    }
    // Update Doctor
    public Doctor updateDoctor(Doctor doctor) {
        if (doctorRepo.existsById(doctor.getDoctorId())) {
            return doctorRepo.save(doctor);
        } else {
            throw new IllegalArgumentException("Doctor not found with ID: " + doctor.getDoctorId());
        }
    }

    // Delete Doctor
    public void deleteDoctor(String doctorId) {
        if (doctorRepo.existsById(doctorId)) {
            doctorRepo.deleteById(doctorId);
        } else {
            throw new IllegalArgumentException("Doctor not found with ID: " + doctorId);
        }
    }

    // Update Patient
    public Patient updatePatient(Patient patient) {
        if (patientRepo.existsById(patient.getPatientId())) {
            return patientRepo.save(patient);
        } else {
            throw new IllegalArgumentException("Patient not found with ID: " + patient.getPatientId());
        }
    }

    // Delete Patient
    public void deletePatient(String patientId) {
        if (patientRepo.existsById(Integer.valueOf(patientId))) {
            patientRepo.deleteById(Integer.valueOf(patientId));
        } else {
            throw new IllegalArgumentException("Patient not found with ID: " + patientId);
        }
    }
}

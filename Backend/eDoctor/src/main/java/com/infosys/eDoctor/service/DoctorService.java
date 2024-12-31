package com.infosys.eDoctor.service;

import com.infosys.eDoctor.DTO.DoctorDTO;
import com.infosys.eDoctor.entity.Doctor;
import com.infosys.eDoctor.entity.Users;
import com.infosys.eDoctor.repository.DoctorRepo;
import com.infosys.eDoctor.request.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepo doctorRepo;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    // Add new doctor
    public Doctor addDoctor(Doctor doctor) {
        // Encrypt password
        doctor.getUsers().setPassword(doctor.getUsers().getPassword());
        if (doctor != null) {

            // Email to doctor
            String doctorSubject = "Welcome to eDoctor!";
            String doctorBody = "Dear Dr. " + doctor.getDoctorName() + ",\n\n" +
                    "Thank you for joining eDoctor. Your account has been successfully created.\n\n" +
                    "Here are your account details:\n" +
                    "Name: Dr. " + doctor.getDoctorName() + "\n" +
                    "Speciality: " + doctor.getSpeciality() + "\n" +
                    "Email: " + doctor.getUsers().getEmail() + "\n" +
                    "Mobile Number: " + doctor.getMobileNo() + "\n\n" +
                    "We are thrilled to have you as part of our team. Please log in to your account to manage appointments and patient interactions.\n\n" +
                    "Thank you,\nThe eDoctor Team";
            sendEmail(doctor.getUsers().getEmail(), doctorSubject, doctorBody);
        }
        return doctorRepo.save(doctor);


    }

    // Get doctor by ID
    public Optional<Doctor> getDoctorById(String doctorId) {
        return doctorRepo.findById(doctorId);
    }

    // Get doctor by email
    public DoctorDTO getDoctorByEmail(String email) {
        // Find doctor by email in the 'users' table (assuming the relationship is set correctly)
        Optional<Doctor> doctorOpt = doctorRepo.findByUsers_Email(email);

        if (doctorOpt.isPresent()) {
            Doctor doctor = doctorOpt.get();
            // Map doctor entity to DoctorDTO
            return new DoctorDTO(
                    doctor.getDoctorId(),
                    doctor.getDoctorName(),
                    doctor.getSpeciality(),
                    doctor.getLocation(),
                    doctor.getExperience(),
                    doctor.getMobileNo(),
                    doctor.getUsers().getEmail() // Get email from the associated Users entity
            );
        } else {
            return null; // Return null or handle as appropriate if no doctor found
        }
    }
    // Get all doctors
    public List<DoctorDTO> getAllDoctors() {
        // Fetch all doctors and map each Doctor entity to a DoctorDTO
        return doctorRepo.findAll().stream()
                .map(doctor -> new DoctorDTO(
                        doctor.getDoctorId(),
                        doctor.getDoctorName(),
                        doctor.getSpeciality(),
                        doctor.getLocation(),
                        doctor.getExperience(),
                        doctor.getMobileNo(),
                        doctor.getUsers().getEmail() // Map email from the associated Users entity
                ))
                .collect(Collectors.toList());
    }
    // Update doctor details
    public Doctor updateDoctor(Doctor doctor) {
        Doctor existingDoctor = doctorRepo.findById(doctor.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        existingDoctor.setDoctorName(doctor.getDoctorName());
        existingDoctor.setSpeciality(doctor.getSpeciality());
        existingDoctor.setLocation(doctor.getLocation());
        existingDoctor.setExperience(doctor.getExperience());
        existingDoctor.setMobileNo(doctor.getMobileNo());
        existingDoctor.getUsers().setEmail(doctor.getUsers().getEmail());

        return doctorRepo.save(existingDoctor);
    }

    // Delete doctor
    public void deleteDoctor(String doctorId) {
        doctorRepo.deleteById(doctorId);
    }

    // Authenticate doctor
    public boolean authenticateDoctor(String email, String password) {
        Optional<Doctor> doctor = doctorRepo.findByUsers_Email(email);
        return doctor.map(value -> passwordEncoder.matches(password, value.getUsers().getPassword())).orElse(false);
    }


    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }
}

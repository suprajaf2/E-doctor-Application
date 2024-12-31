package com.infosys.eDoctor.controller;

import com.infosys.eDoctor.DTO.*;
import com.infosys.eDoctor.entity.*;
import com.infosys.eDoctor.request.LoginRequest;
import com.infosys.eDoctor.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    AdminService adminService;
    @Autowired
    DoctorService doctorService;
    @Autowired
    PatientService patientService;
    @Autowired
    AvailabilityService availabilityService;
    @Autowired
    AppointmentService appointmentService;

    @PostMapping("/addAdmin")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> addAdmin(@RequestBody Admin admin) {
        adminService.saveAdmin(admin);
        return ResponseEntity.ok("Admin added successfully!");
    }


    @PostMapping("/login")
    public boolean login(@RequestBody Admin admin) {
        boolean isAuthenticated = adminService.authenticateAdmin(admin.getAdminname(), admin.getPassword());
        return  isAuthenticated;
    }
    @GetMapping("/getAllDoctors")
    @CrossOrigin(origins = "http://localhost:3000")
    public List<DoctorDTO> getAllDoctors() {
        return doctorService.getAllDoctors(); // Return the list of DoctorDTOs
    }

    @GetMapping("/getAllAppointments")
    @CrossOrigin(origins = "http://localhost:3000")
    public List<AppointmentDTO> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    // Get all patients (admin use)
    @GetMapping("/getAllPatients")
    @CrossOrigin(origins = "http://localhost:3000")
    public List<PatientDTO> getAllPatients() {
        return patientService.getAllPatients();
    }

    @GetMapping("/getAllAvailability")
    @CrossOrigin(origins = "http://localhost:3000")
    public List<AvailabilityDTO> getAllAvailability() {
        return availabilityService.getAllAvailability();
    }

    @GetMapping("/stats")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> getAdminStatistics() {
        return ResponseEntity.ok().body(new Object() {
            public final long totalUsers = adminService.getTotalUsers();
            public final long totalDoctors = adminService.getTotalDoctors();
            public final long totalPatients = adminService.getTotalPatients();
            public final long totalFeedbacks = adminService.getTotalFeedbacks();
        });
    }

    // Update Doctor
    @PutMapping("/updateDoctor")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> updateDoctor(@RequestBody Doctor doctor) {
        try {
            Doctor updatedDoctor = adminService.updateDoctor(doctor);
            return ResponseEntity.ok(updatedDoctor);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete Doctor
    @DeleteMapping("/deleteDoctor/{doctorId}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> deleteDoctor(@PathVariable String doctorId) {
        try {
            adminService.deleteDoctor(doctorId);
            return ResponseEntity.ok("Doctor deleted successfully!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Update Patient
    @PutMapping("/updatePatient")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> updatePatient(@RequestBody Patient patient) {
        try {
            Patient updatedPatient = adminService.updatePatient(patient);
            return ResponseEntity.ok(updatedPatient);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete Patient
    @DeleteMapping("/deletePatient/{patientId}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> deletePatient(@PathVariable String patientId) {
        try {
            adminService.deletePatient(patientId);
            return ResponseEntity.ok("Patient deleted successfully!");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/doctor")
    public List<AppointmentDTO> getAppointmentsByDoctorId(@RequestParam String doctorId) {
        return appointmentService.getAppointmentsByDoctorId(doctorId);
    }

    @GetMapping("/date")
    public List<AppointmentDTO> getAppointmentsByDate(@RequestParam LocalDate date) {
        return appointmentService.getAppointmentsByDate(date);
    }

    @GetMapping("/availability/count")
    public int getAvailabilityCountForDoctor(@RequestParam String doctorId,LocalDate date) {
        return appointmentService.getAvailabilityCountForDoctor(doctorId,date);
    }
    // updated part -20-12-2024
    @GetMapping("/patients")
    public List<PatientWithAppointmentDTO> getPatientsByDoctorAndDate(@RequestParam String doctorId, @RequestParam String date) {
        LocalDate appointmentDate = LocalDate.parse(date);
        return appointmentService.getPatientsByDoctorAndDate(doctorId, appointmentDate);
    }

}

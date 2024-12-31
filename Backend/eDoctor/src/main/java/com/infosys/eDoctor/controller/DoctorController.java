package com.infosys.eDoctor.controller;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.infosys.eDoctor.DTO.DoctorDTO;
import com.infosys.eDoctor.entity.Appointment;
import com.infosys.eDoctor.entity.Doctor;
import com.infosys.eDoctor.entity.Patient;
import com.infosys.eDoctor.service.AppointmentService;
import com.infosys.eDoctor.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @Autowired
    private AppointmentService appointmentService;
    // Add new doctor
    @PostMapping("/addDoctor")
    @CrossOrigin(origins = "http://localhost:3000")
    public Doctor addDoctor(@RequestBody Doctor doctor) {
        return doctorService.addDoctor(doctor);
    }

    // Get doctor by ID

    @GetMapping("/getDoctor/{doctorId}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<DoctorDTO> getDoctorById(@PathVariable String doctorId) {
        Optional<Doctor> doctorOptional = doctorService.getDoctorById(doctorId);
        if (doctorOptional.isPresent()) {
            Doctor doctor = doctorOptional.get();
            // Map Doctor to DoctorDTO
            DoctorDTO doctorDTO = new DoctorDTO(
                    doctor.getDoctorId(),
                    doctor.getDoctorName(),
                    doctor.getSpeciality(),
                    doctor.getLocation(),
                    doctor.getExperience(),
                    doctor.getMobileNo(),
                    doctor.getUsers().getEmail() // Extract email from Users entity
            );
            return ResponseEntity.ok(doctorDTO);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Return 404 if not found
        }
    }

    // Get doctor by email
    @GetMapping("/getDoctorByEmail")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<DoctorDTO> getDoctorByEmail(@RequestParam String email) {
        DoctorDTO doctorDTO = doctorService.getDoctorByEmail(email);

        if (doctorDTO != null) {
            return ResponseEntity.ok(doctorDTO); // Return the DoctorDTO
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null); // Handle not found
        }
    }

    @GetMapping("/getAllDoctors")
    @CrossOrigin(origins = "http://localhost:3000")
    public List<DoctorDTO> getAllDoctors() {
        return doctorService.getAllDoctors(); // Return the list of DoctorDTOs
    }


    // Update doctor details
    @PutMapping("/updateDoctor")
    @CrossOrigin(origins = "http://localhost:3000")
    public Doctor updateDoctor(@RequestBody Doctor doctor) {
        return doctorService.updateDoctor(doctor);
    }

    // Delete doctor
    @DeleteMapping("/deleteDoctor/{doctorId}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<String> deleteDoctor(@PathVariable String doctorId) {
        doctorService.deleteDoctor(doctorId);
        return ResponseEntity.ok("Doctor deleted successfully");
    }


    // Doctor login
    @PostMapping("/login")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        boolean isAuthenticated = doctorService.authenticateDoctor(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        if (isAuthenticated) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PutMapping("/updateAppointmentStatus")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<String> updateAppointmentStatus(
            @RequestParam int appointmentId,
            @RequestParam String status) {
        Optional<Appointment> optionalAppointment = appointmentService.getAppointmentEntity(appointmentId);

        if (optionalAppointment.isPresent()) {
            Appointment appointment = optionalAppointment.get();

            // Update the status
            appointment.setAppointmentStatus(status);
            appointmentService.updateAppointment(appointment);

            // Notify the patient based on the new status
            Patient patient = appointment.getPatient();
            Doctor doctor = appointment.getDoctor();

            if (patient != null && doctor != null) {
                String patientSubject;
                String patientBody;

                if (status.equalsIgnoreCase("Scheduled")) {
                    patientSubject = "Appointment Confirmed";
                    patientBody = "Dear " + patient.getPatientName() + ",\n\n" +
                            "Your appointment with Dr. " + doctor.getDoctorName() +
                            " on " + appointment.getAppointmentDate() + " has been confirmed.\n\nThank you!";
                } else if (status.equalsIgnoreCase("Cancelled")) {
                    patientSubject = "Appointment Cancelled";
                    patientBody = "Dear " + patient.getPatientName() + ",\n\n" +
                            "We regret to inform you that your appointment with Dr. " + doctor.getDoctorName() +
                            " on " + appointment.getAppointmentDate() + " has been cancelled.\n\nThank you!";
                } else {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status provided.");
                }

                // Send email to the patient
                appointmentService.sendEmail(patient.getUsers2().getEmail(), patientSubject, patientBody);
            }

            String responseMessage = "Appointment status updated to " + status + " and patient notified.";
            return ResponseEntity.ok(responseMessage);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found.");
        }
    }


    // Inner class for login request
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}

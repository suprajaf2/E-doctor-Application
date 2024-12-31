package com.infosys.eDoctor.controller;

import com.infosys.eDoctor.DTO.AppointmentDTO;
import com.infosys.eDoctor.DTO.PatientDTO;
import com.infosys.eDoctor.DTO.PatientWithAppointmentDTO;
import com.infosys.eDoctor.entity.Appointment;
import com.infosys.eDoctor.entity.Patient;
import com.infosys.eDoctor.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private JavaMailSender mailSender;

    @GetMapping
    public List<AppointmentDTO> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/{id}")
    public AppointmentDTO getAppointment(@PathVariable int id) {
        return appointmentService.getAppointment(id);
    }

    @PostMapping
    public Appointment addAppointment(@RequestBody Appointment appointment) {
        return appointmentService.addAppointment(appointment);
    }

    @PutMapping
    public Appointment updateAppointment(@RequestBody Appointment appointment) {
        return appointmentService.updateAppointment(appointment);
    }

    @DeleteMapping("/{id}")
    public void deleteAppointment(@PathVariable int id) {
        appointmentService.deleteAppointment(id);
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
    public int getAvailabilityCountForDoctor(@RequestParam String doctorId, @RequestParam LocalDate date) {
        return appointmentService.getAvailabilityCountForDoctor(doctorId, date);
    }

    // updated part -20-12-2024
    @GetMapping("/patients")
    public List<PatientWithAppointmentDTO> getPatientsByDoctorAndDate(@RequestParam String doctorId, @RequestParam String date) {
        LocalDate appointmentDate = LocalDate.parse(date);
        return appointmentService.getPatientsByDoctorAndDate(doctorId, appointmentDate);
    }

    @GetMapping("/patient")
    public List<AppointmentDTO> getAppointmentsByPatientId(@RequestParam int patientId) {
        return appointmentService.getAppointmentsByPatientId(patientId);
    }



}

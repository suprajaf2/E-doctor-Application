package com.infosys.eDoctor.service;

import com.infosys.eDoctor.DTO.AppointmentDTO;
import com.infosys.eDoctor.DTO.PatientDTO;
import com.infosys.eDoctor.DTO.PatientWithAppointmentDTO;
import com.infosys.eDoctor.entity.Appointment;
import com.infosys.eDoctor.entity.Doctor;
import com.infosys.eDoctor.entity.Patient;
import com.infosys.eDoctor.repository.AppointmentRepo;
import com.infosys.eDoctor.repository.DoctorRepo;
import com.infosys.eDoctor.repository.PatientRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepo appointmentRepository;

    @Autowired
    private DoctorRepo doctorRepo;

    @Autowired
    private PatientRepo patientRepo;

    @Autowired
    private JavaMailSender mailSender;

    private static final int MAX_APPOINTMENTS_PER_DAY = 5;

    // Helper method to convert Appointment to AppointmentDTO
    private AppointmentDTO convertToDTO(Appointment appointment) {
        return new AppointmentDTO(
                appointment.getAppointmentId(),
                appointment.getAppointmentDate(),
                appointment.getAppointmentStatus(),
                appointment.getRemark(),
                appointment.getPatient().getPatientId(),
                appointment.getDoctor().getDoctorId()
        );
    }

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AppointmentDTO getAppointment(int id) {
        Appointment appointment = appointmentRepository.findById(id).orElse(null);
        return appointment != null ? convertToDTO(appointment) : null;
    }

    public List<AppointmentDTO> getAppointmentsByDoctorId(String doctorId) {
        return appointmentRepository.findByDoctor_DoctorId(doctorId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getAppointmentsByPatientId(int patientId) {
        return appointmentRepository.findByPatient_PatientId(patientId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    public List<AppointmentDTO> getAppointmentsByDate(LocalDate date) {
        return appointmentRepository.findByAppointmentDate(date).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<PatientWithAppointmentDTO> getPatientsByDoctorAndDate(String doctorId, LocalDate date) {
        List<Appointment> appointments = appointmentRepository.findByDoctor_DoctorIdAndAppointmentDate(doctorId, date);

        return appointments.stream()
                .map(appointment -> {
                    Patient patient = appointment.getPatient();
                    if (patient != null) {
                        return new PatientWithAppointmentDTO(
                                patient.getPatientId(),
                                patient.getPatientName(),
                                patient.getMobileNo(),
                                patient.getBloodGroup(),
                                patient.getGender(),
                                patient.getAge(),
                                patient.getAddress(),
                                patient.getRequestStatus(),
                                appointment.getAppointmentId(),
                                appointment.getAppointmentStatus()
                        );
                    }
                    return null;
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }


    public int getAvailabilityCountForDoctor(String doctorId, LocalDate date) {
        return MAX_APPOINTMENTS_PER_DAY - appointmentRepository.countAppointmentsByDoctorAndDate(doctorId, date);
    }

    public Appointment addAppointment(Appointment appointment) {
        // Check if the patient already has an appointment with the doctor on the given date
        List<Appointment> existingAppointments = appointmentRepository.findByDoctor_DoctorIdAndAppointmentDate(
                        appointment.getDoctor().getDoctorId(), appointment.getAppointmentDate()
                ).stream()
                .filter(a -> Objects.equals(a.getPatient().getPatientId(), appointment.getPatient().getPatientId()))
                .collect(Collectors.toList());

        if (!existingAppointments.isEmpty()) {
            throw new IllegalStateException("You can only book one appointment with this doctor per day.");
        }

        int currentAppointments = appointmentRepository.countAppointmentsByDoctorAndDate(
                appointment.getDoctor().getDoctorId(), appointment.getAppointmentDate()
        );
        if (currentAppointments >= MAX_APPOINTMENTS_PER_DAY) {
            throw new IllegalStateException("Maximum number of appointments reached for this date.");
        }

        // Default status as Pending
        appointment.setAppointmentStatus("Pending");
        Appointment savedAppointment = appointmentRepository.save(appointment);

        Patient patient = patientRepo.findById(appointment.getPatient().getPatientId()).orElse(null);
        Doctor doctor = doctorRepo.findById(appointment.getDoctor().getDoctorId()).orElse(null);

        if (patient != null && doctor != null) {
            // Email to patient
            String patientSubject = "Appointment Request Received";
            String patientBody = "Dear " + patient.getPatientName() + ",\n\n" +
                    "Your appointment request with Dr. " + doctor.getDoctorName() +
                    " on " + appointment.getAppointmentDate() + " is currently pending.\n\n" +
                    "You will be notified once the doctor reviews your request.\n\nThank you!";
            sendEmail(patient.getUsers2().getEmail(), patientSubject, patientBody);

            // Email to doctor
            String doctorSubject = "New Appointment Request";
            String doctorBody = "Dear Dr. " + doctor.getDoctorName() + ",\n\n" +
                    "A new appointment request from patient " + patient.getPatientName() +
                    " has been made for " + appointment.getAppointmentDate() + ".\n\n" +
                    "Please log in to review and confirm or cancel the appointment.\n\nThank you!";
            sendEmail(doctor.getUsers().getEmail(), doctorSubject, doctorBody);
        }

        return savedAppointment;
    }



    public Appointment updateAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public void deleteAppointment(int id) {
        appointmentRepository.deleteById(id);
    }
    public Optional<Appointment> getAppointmentEntity(int id) {
        return appointmentRepository.findById(id);
    }


    public void sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        mailSender.send(message);
    }

    public Appointment createAppointment(AppointmentDTO appointmentDTO) {
        Appointment appointment = new Appointment();
        appointment.setDoctor(doctorRepo.findById(appointmentDTO.getDoctorId()).orElseThrow(() ->
                new IllegalArgumentException("Doctor not found")));
        appointment.setPatient(patientRepo.findById(appointmentDTO.getPatientId()).orElseThrow(() ->
                new IllegalArgumentException("Patient not found")));
        appointment.setAppointmentDate(appointmentDTO.getAppointmentDate());
        appointment.setAppointmentStatus("Pending");
        return appointmentRepository.save(appointment);
    }
}

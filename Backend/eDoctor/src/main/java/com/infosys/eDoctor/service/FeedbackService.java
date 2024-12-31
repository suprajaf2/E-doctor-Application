package com.infosys.eDoctor.service;

import com.infosys.eDoctor.DTO.FeedbackDTO;
import com.infosys.eDoctor.entity.*;
import com.infosys.eDoctor.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FeedbackService {
    @Autowired
    private FeedbackRepo feedbackRepository;

    @Autowired
    private DoctorRepo doctorRepo;

    @Autowired
    private PatientRepo patientRepo;

    @Autowired
    private AppointmentRepo appointmentRepo;

    public FeedbackDTO addFeedback(FeedbackDTO feedbackDTO) {
        Feedback feedback = new Feedback();

        // Set the relationships
        feedback.setPatient(patientRepo.findById(feedbackDTO.getPatientId())
                .orElseThrow(() -> new RuntimeException("Patient not found")));
        feedback.setDoctor(doctorRepo.findById(feedbackDTO.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found")));
        feedback.setAppointment(appointmentRepo.findById(feedbackDTO.getAppointmentId())
                .orElseThrow(() -> new RuntimeException("Appointment not found")));

        // Set other fields
        feedback.setRating(feedbackDTO.getRating());
        feedback.setComment(feedbackDTO.getComment());
        feedback.setFeedbackDate(LocalDateTime.now());

        // Save and return
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return convertToDTO(savedFeedback);
    }

    public List<FeedbackDTO> getFeedbacksByDoctor(String doctorId) {
        return feedbackRepository.findByDoctor_DoctorId(doctorId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<FeedbackDTO> getFeedbacksByPatient(int patientId) {
        return feedbackRepository.findByPatient_PatientId(patientId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private FeedbackDTO convertToDTO(Feedback feedback) {
        return new FeedbackDTO(
                feedback.getId(),
                feedback.getPatient().getPatientId(),
                feedback.getDoctor().getDoctorId(),
                feedback.getRating(),
                feedback.getComment(),
                feedback.getFeedbackDate().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME),
                feedback.getAppointment().getAppointmentId()
        );
    }
}
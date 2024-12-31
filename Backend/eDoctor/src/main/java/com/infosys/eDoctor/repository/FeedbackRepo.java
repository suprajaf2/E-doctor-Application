package com.infosys.eDoctor.repository;

import com.infosys.eDoctor.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FeedbackRepo extends JpaRepository<Feedback, Long> {
    List<Feedback> findByDoctor_DoctorId(String doctorId);
    List<Feedback> findByPatient_PatientId(int patientId);
    List<Feedback> findByAppointment_AppointmentId(int appointmentId);
}
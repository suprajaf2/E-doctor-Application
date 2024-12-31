package com.infosys.eDoctor.controller;

import com.infosys.eDoctor.DTO.FeedbackDTO;
import com.infosys.eDoctor.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<FeedbackDTO> addFeedback(@RequestBody FeedbackDTO feedbackDTO) {
        FeedbackDTO saved = feedbackService.addFeedback(feedbackDTO);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/doctor/{doctorId}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<List<FeedbackDTO>> getFeedbacksByDoctor(@PathVariable String doctorId) {
        List<FeedbackDTO> feedbacks = feedbackService.getFeedbacksByDoctor(doctorId);
        return ResponseEntity.ok(feedbacks);
    }

    @GetMapping("/patient/{patientId}")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<List<FeedbackDTO>> getFeedbacksByPatient(@PathVariable int patientId) {
        List<FeedbackDTO> feedbacks = feedbackService.getFeedbacksByPatient(patientId);
        return ResponseEntity.ok(feedbacks);
    }
}

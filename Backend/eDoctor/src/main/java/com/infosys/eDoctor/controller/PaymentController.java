package com.infosys.eDoctor.controller;

import com.infosys.eDoctor.DTO.AppointmentDTO;
import com.infosys.eDoctor.entity.Appointment;
import com.infosys.eDoctor.service.AppointmentService;
import com.infosys.eDoctor.service.PaymentService;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/create-checkout-session")
    @CrossOrigin(origins = "http://localhost:3000")
    public ResponseEntity<?> createCheckoutSession(@RequestBody Map<String, Object> payload) {
        try {
            // Extract appointmentId and amount from the payload
            int appointmentId = (int) payload.get("appointmentId");
            double amount = Double.parseDouble(payload.get("amount").toString());

            // Fetch the appointment by appointmentId
            Optional<Appointment> optionalAppointment = appointmentService.getAppointmentEntity(appointmentId);

            if (optionalAppointment.isPresent()) {
                Appointment appointment = optionalAppointment.get();

                // Update the payment status to PAYMENT_PENDING
                appointment.setAppointmentStatus("Scheduled And Paid");
                appointmentService.updateAppointment(appointment);

                // Create Stripe checkout session with the dynamic amount
                String sessionUrl = paymentService.createCheckoutSession(appointment.getAppointmentId(), amount);

                Map<String, String> response = new HashMap<>();
                response.put("sessionUrl", sessionUrl);
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found.");
            }
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to create checkout session: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Invalid request payload: " + e.getMessage());
        }
    }

    @GetMapping("/success")
    public ResponseEntity<?> handleSuccess(@RequestParam("session_id") String sessionId) {
        try {
            // Verify payment session
            Session session = paymentService.verifyPayment(sessionId);

            // Extract appointmentId from metadata
            String appointmentId = session.getMetadata().get("appointmentId");

            // Update payment status only
            Optional<Appointment> optionalAppointment = appointmentService.getAppointmentEntity(Integer.parseInt(appointmentId));

            if (optionalAppointment.isPresent()) {
                Appointment appointment = optionalAppointment.get();
                appointment.setAppointmentStatus("PAYMENT_CONFIRMED");
                appointmentService.updateAppointment(appointment);
                return ResponseEntity.ok("Payment confirmed and status updated.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Appointment not found.");
            }
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to verify payment: " + e.getMessage());
        }
    }
}

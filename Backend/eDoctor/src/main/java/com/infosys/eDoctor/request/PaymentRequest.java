package com.infosys.eDoctor.request;

public class PaymentRequest {
    private Integer appointmentId; // Ensure this is Integer
    private Double amount;         // Ensure this is Double

    // Getters and Setters
    public Integer getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Integer appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
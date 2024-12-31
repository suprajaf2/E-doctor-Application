package com.infosys.eDoctor.DTO;

public class FeedbackDTO {
    private Long id;
    private int patientId;
    private String doctorId;
    private int rating;
    private String comment;
    private String feedbackDate;
    private int appointmentId;

    // Constructors
    public FeedbackDTO() {}

    public FeedbackDTO(Long id, int patientId, String doctorId, int rating,
                       String comment, String feedbackDate, int appointmentId) {
        this.id = id;
        this.patientId = patientId;
        this.doctorId = doctorId;
        this.rating = rating;
        this.comment = comment;
        this.feedbackDate = feedbackDate;
        this.appointmentId = appointmentId;
    }

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getPatientId() { return patientId; }
    public void setPatientId(int patientId) { this.patientId = patientId; }

    public String getDoctorId() { return doctorId; }
    public void setDoctorId(String doctorId) { this.doctorId = doctorId; }

    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getFeedbackDate() { return feedbackDate; }
    public void setFeedbackDate(String feedbackDate) { this.feedbackDate = feedbackDate; }

    public int getAppointmentId() { return appointmentId; }
    public void setAppointmentId(int appointmentId) { this.appointmentId = appointmentId; }
}

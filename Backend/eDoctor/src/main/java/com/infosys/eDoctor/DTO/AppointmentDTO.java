package com.infosys.eDoctor.DTO;

import java.time.LocalDate;

public class AppointmentDTO {
    private int appointmentId;
    private LocalDate appointmentDate;
    private String appointmentStatus;
    private String remark;
    private int patientId;
    private String doctorId;
    private double amount;
    AppointmentDTO(){}

    public AppointmentDTO(int appointmentId, LocalDate appointmentDate, String appointmentStatus, String remark, int patientId, String doctorId){
       this.appointmentId=appointmentId;
        this.appointmentDate=appointmentDate;
       this.appointmentStatus=appointmentStatus;
        this.remark=remark;
        this.patientId=patientId;
        this.doctorId=doctorId;
    }

    public int getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(int appointmentId) {
        this.appointmentId = appointmentId;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getAppointmentStatus() {
        return appointmentStatus;
    }

    public void setAppointmentStatus(String appointmentStatus) {
        this.appointmentStatus = appointmentStatus;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public int getPatientId() {
        return patientId;
    }

    public void setPatientId(int patientId) {
        this.patientId = patientId;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public double getAmount() {
        return amount;
    }
    public void setAmount(double amount) {
        this.amount = amount;
    }
}

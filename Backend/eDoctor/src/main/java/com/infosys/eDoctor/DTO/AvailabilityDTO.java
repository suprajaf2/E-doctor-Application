package com.infosys.eDoctor.DTO;

import jakarta.persistence.Column;

import java.time.LocalDate;

public class AvailabilityDTO {

    private int availabilityId;
    private LocalDate startDate;
    private LocalDate endDate;
    private String doctorId;
    AvailabilityDTO(){
    }
    public AvailabilityDTO(int availabilityId, LocalDate startDate, LocalDate endDate, String doctorId){
        this.availabilityId=availabilityId;
        this.startDate=startDate;
        this.endDate=endDate;
        this.doctorId=doctorId;
    }

    public int getAvailabilityId() {
        return availabilityId;
    }

    public void setAvailabilityId(int availabilityId) {
        this.availabilityId = availabilityId;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }
}

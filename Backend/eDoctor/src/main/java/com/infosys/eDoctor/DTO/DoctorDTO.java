package com.infosys.eDoctor.DTO;

public class DoctorDTO {
    private String doctorId;
    private String doctorName;
    private String speciality;
    private String location;
    private String experience;
    private String mobileNo;
    private String email;

    public DoctorDTO(String doctorId, String doctorName, String speciality,
                     String location, String experience, String mobileNo, String email) {
        this.doctorId = doctorId;
        this.doctorName = doctorName;
        this.speciality = speciality;
        this.location = location;
        this.experience = experience;
        this.mobileNo = mobileNo;
        this.email = email;
    }

    public String getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(String doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getSpeciality() {
        return speciality;
    }

    public void setSpeciality(String speciality) {
        this.speciality = speciality;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getMobileNo() {
        return mobileNo;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

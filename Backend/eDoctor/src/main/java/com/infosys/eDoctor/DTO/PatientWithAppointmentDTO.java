package com.infosys.eDoctor.DTO;

public class PatientWithAppointmentDTO {
    private int patientId;
    private String patientName;
    private String mobileNo;
    private String bloodGroup;
    private String gender;
    private int age;
    private String address;
    private String requestStatus;
    private int appointmentId;
    private String appointmentStatus;
    // Constructor
    public PatientWithAppointmentDTO(int patientId, String patientName, String mobileNo, String bloodGroup,
                                     String gender, int age, String address, String requestStatus, int appointmentId, String appointmentStatus) {
        this.patientId = patientId;
        this.patientName = patientName;
        this.mobileNo = mobileNo;
        this.bloodGroup = bloodGroup;
        this.gender = gender;
        this.age = age;
        this.address = address;
        this.requestStatus = requestStatus;
        this.appointmentId = appointmentId;
        this.appointmentStatus = appointmentStatus;
    }

    public String getAppointmentStatus() {
        return appointmentStatus;
    }

    public void setAppointmentStatus(String appointmentStatus) {
        this.appointmentStatus = appointmentStatus;
    }

    public int getPatientId() {
        return patientId;
    }

    public void setPatientId(int patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getMobileNo() {
        return mobileNo;
    }

    public void setMobileNo(String mobileNo) {
        this.mobileNo = mobileNo;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRequestStatus() {
        return requestStatus;
    }

    public void setRequestStatus(String requestStatus) {
        this.requestStatus = requestStatus;
    }

    public int getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(int appointmentId) {
        this.appointmentId = appointmentId;
    }
// Getters and setters
    // ...
}

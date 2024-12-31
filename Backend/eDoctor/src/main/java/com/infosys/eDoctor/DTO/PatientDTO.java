package com.infosys.eDoctor.DTO;

import com.infosys.eDoctor.entity.Patient;

public class PatientDTO {

    private int patientId;
    private String patientName;
    private String mobileNo;
    private String bloodGroup;
    private String gender;
    private int age;
    private String address;
    private String email;

    public PatientDTO(int patientId, String patientName, String mobileNo, String email, String bloodGroup, String gender, int age, String address) {
        this.patientId = patientId;
        this.patientName = patientName;
        this.mobileNo = mobileNo;
        this.bloodGroup = bloodGroup;
        this.gender = gender;
        this.age = age;
        this.address = address;
        this.email=email;
    }
    public static PatientDTO fromEntity(Patient patient) {
        return new PatientDTO(
                patient.getPatientId(),
                patient.getPatientName(),
                patient.getMobileNo(),
                patient.getUsers2() != null ? patient.getUsers2().getEmail() : null, // Assuming Users entity has getEmail method
                patient.getBloodGroup(),
                patient.getGender(),
                patient.getAge(),
                patient.getAddress()
        );
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

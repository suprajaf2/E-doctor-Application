package com.infosys.eDoctor.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class Admin {

    @Id
    String adminname;
    String password;

    public Admin()
    {

    }
    public Admin(String adminname,String password)
    {
        this.adminname=adminname;
        this.password=password;
    }
    public String getAdminname() {
        return adminname;
    }

    public void setAdminname(String adminname) {
        this.adminname = adminname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

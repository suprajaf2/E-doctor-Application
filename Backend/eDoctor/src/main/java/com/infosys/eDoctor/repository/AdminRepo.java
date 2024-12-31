package com.infosys.eDoctor.repository;

import com.infosys.eDoctor.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepo extends JpaRepository<Admin,String> {
}

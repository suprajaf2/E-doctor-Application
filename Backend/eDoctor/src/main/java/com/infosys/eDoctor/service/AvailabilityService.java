package com.infosys.eDoctor.service;

import com.infosys.eDoctor.DTO.AvailabilityDTO;
import com.infosys.eDoctor.entity.Availability;
import com.infosys.eDoctor.repository.AvailabilityRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AvailabilityService {

    @Autowired
    private AvailabilityRepo availabilityRepo;

    public Availability addAvailability(Availability availability) {
        return availabilityRepo.save(availability);
    }

    // Convert Availability entity to AvailabilityDTO
    private AvailabilityDTO convertToDTO(Availability availability) {
        // Check if doctor2 is null
        if (availability.getDoctor2() != null) {
            return new AvailabilityDTO(
                    availability.getAvailabilityId(),
                    availability.getStartDate(),
                    availability.getEndDate(),
                    availability.getDoctor2().getDoctorId()
            );
        } else {
            // Handle the case where doctor2 is null (maybe return a default ID or throw an exception)
            return new AvailabilityDTO(
                    availability.getAvailabilityId(),
                    availability.getStartDate(),
                    availability.getEndDate(),
                    null // or a default doctor ID, if appropriate
            );
        }
    }

    public List<AvailabilityDTO> getAvailabilityByDoctorId(String doctorId) {
        List<Availability> availabilityList = availabilityRepo.findByDoctor2_DoctorId(doctorId);
        return availabilityList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<AvailabilityDTO> getAllAvailability() {
        List<Availability> availabilityList = availabilityRepo.findAll();
        return availabilityList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
}

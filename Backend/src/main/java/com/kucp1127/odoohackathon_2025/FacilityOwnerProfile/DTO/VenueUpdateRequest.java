package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// VenueUpdateRequest.java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class VenueUpdateRequest {
    public String name;
    public String description;
    public String address;
    public List<String> photoUrls;
    public List<String> amenities;
}

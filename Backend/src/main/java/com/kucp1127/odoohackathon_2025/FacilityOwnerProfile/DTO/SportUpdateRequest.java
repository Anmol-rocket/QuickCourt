package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

// SportUpdateRequest.java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SportUpdateRequest {
    public String name;
    public String type;
    public BigDecimal pricePerHour;
    public String operatingHours;
}

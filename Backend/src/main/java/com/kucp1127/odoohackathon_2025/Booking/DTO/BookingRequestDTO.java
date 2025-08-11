package com.kucp1127.odoohackathon_2025.Booking.DTO;

import lombok.Data;

import java.util.List;

@Data
public class BookingRequestDTO {
    private Long sportId;
    private Long venueId;
    private String facilityOwnerEmail;
    private String userEmail;
    private List<SlotDTO> slots;
}
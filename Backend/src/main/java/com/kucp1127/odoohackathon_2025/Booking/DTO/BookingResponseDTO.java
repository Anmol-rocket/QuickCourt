package com.kucp1127.odoohackathon_2025.Booking.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BookingResponseDTO {
    private Long id;
    private Long sportId;
    private Long venueId;
    private String facilityOwnerEmail;
    private String userEmail;
    private List<SlotDTO> slots;
    private String status;
    private BigDecimal totalPrice;
    private LocalDateTime createdAt;
}

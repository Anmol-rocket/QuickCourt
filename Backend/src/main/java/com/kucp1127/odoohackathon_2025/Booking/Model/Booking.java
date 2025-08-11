package com.kucp1127.odoohackathon_2025.Booking.Model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long sportId;
    private Long venueId;
    private String facilityOwnerEmail;
    private String userEmail;

    @ElementCollection
    @CollectionTable(name = "booking_slots", joinColumns = @JoinColumn(name = "booking_id"))
    private List<SlotPeriod> slots = new ArrayList<>();

    private String status = "CONFIRMED";

    private BigDecimal totalPrice = BigDecimal.ZERO;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Version
    private Long version;

    public void addSlot(SlotPeriod sp) {
        slots.add(sp);
        if (sp.getPrice() != null) {
            totalPrice = totalPrice.add(sp.getPrice());
        }
    }
}

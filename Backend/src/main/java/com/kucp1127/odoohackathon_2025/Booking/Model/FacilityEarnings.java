package com.kucp1127.odoohackathon_2025.Booking.Model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class FacilityEarnings {
    @Id
    private String facilityOwnerEmail;

    private BigDecimal totalEarnings = BigDecimal.ZERO;

    private LocalDateTime lastUpdated = LocalDateTime.now();

    @Version
    private Long version;
}

package com.kucp1127.odoohackathon_2025.Booking.Model;

import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class MonthEarning {

    @Column(name = "month_index")
    private Integer month;
    @Column(name = "earning")
    private BigDecimal earning = BigDecimal.ZERO;
    @Column(name = "recorded_at")
    private LocalDateTime recordedAt = LocalDateTime.now();
}

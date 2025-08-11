package com.kucp1127.odoohackathon_2025.Booking.Controller;

import com.kucp1127.odoohackathon_2025.Booking.Model.FacilityEarnings;
import com.kucp1127.odoohackathon_2025.Booking.Model.MonthEarning;
import com.kucp1127.odoohackathon_2025.Booking.Repository.FacilityEarningsRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Optional;

@RestController
@RequestMapping("/api/earnings")
public class FacilityEarningsController {

    private final FacilityEarningsRepository repo;

    public FacilityEarningsController(FacilityEarningsRepository repo) {
        this.repo = repo;
    }

    @GetMapping("/{email}/monthly")
    public ResponseEntity<BigDecimal[]> getMonthlyEarnings(@PathVariable("email") String email) {
        BigDecimal[] months = new BigDecimal[12];
        Arrays.fill(months, BigDecimal.ZERO);

        Optional<FacilityEarnings> maybe = repo.findById(email);
        if (maybe.isPresent()) {
            for (MonthEarning m : maybe.get().getMonthlyEarnings()) {
                if (m == null) continue;
                Integer idx = m.getMonth();
                if (idx == null) continue;
                if (idx >= 0 && idx < 12) {
                    BigDecimal value = m.getEarning() == null ? BigDecimal.ZERO : m.getEarning();
                    months[idx] = months[idx].add(value);
                }
            }
        }

        return ResponseEntity.ok(months);
    }
}

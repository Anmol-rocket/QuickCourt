package com.kucp1127.odoohackathon_2025.Booking.Model;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class FacilityEarnings {
    @Id
    private String facilityOwnerEmail;

    @ElementCollection
    @CollectionTable(
            name = "facility_monthly_earnings",
            joinColumns = @JoinColumn(name = "facility_owner_email")
    )
    private List<MonthEarning> monthlyEarnings = new ArrayList<>();

    @Version
    private Long version;
}

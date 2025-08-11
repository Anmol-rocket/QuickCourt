package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.kucp1127.odoohackathon_2025.UserRegistration.Model.UserRegistrationsModel;
import com.stripe.param.billing.AlertListParams;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class FacilityOwnerProfile {
    @Id
    private String email;
    @OneToMany(
            mappedBy = "ownerProfile",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY
    )
    @JsonManagedReference("owner-venues")
    private List<Venue> venues = new ArrayList<>();


}

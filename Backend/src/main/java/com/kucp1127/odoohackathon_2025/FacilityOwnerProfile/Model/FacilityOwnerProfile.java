package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model;


import com.kucp1127.odoohackathon_2025.UserRegistration.Model.UserRegistrationsModel;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Holds data specific to a user with the ROLE_FACILITY_OWNER.
 * This creates a clean separation of concerns from the core User entity.
 */
@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class FacilityOwnerProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "user_email", referencedColumnName = "email")
    private UserRegistrationsModel userRegistrationsModel;


    @OneToMany(mappedBy = "ownerProfile", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Venue> venues;

    private boolean isApprovedByAdmin = false;
}

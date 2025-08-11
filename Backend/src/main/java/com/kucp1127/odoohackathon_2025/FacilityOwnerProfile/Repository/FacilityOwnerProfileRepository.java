package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository;

import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model.FacilityOwnerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface FacilityOwnerProfileRepository extends JpaRepository<FacilityOwnerProfile, String> {
    Optional<FacilityOwnerProfile> findByEmail(String email);
}
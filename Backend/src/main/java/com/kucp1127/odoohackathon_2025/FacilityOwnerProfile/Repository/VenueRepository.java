package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository;

import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {
}
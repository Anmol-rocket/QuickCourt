package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model.Sport;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface SportRepository extends JpaRepository<Sport, Long> {
    List<Sport> findByVenueId(Long venueId);

}
package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model.Sport;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface SportRepository extends JpaRepository<Sport, Long> {
    List<Sport> findByVenueId(Long venueId);

}
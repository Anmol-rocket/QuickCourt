package com.kucp1127.odoohackathon_2025.Booking.Repository;

import com.kucp1127.odoohackathon_2025.Booking.Model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByVenueIdAndSportId(Long venueId, Long sportId);
    List<Booking> findByUserEmail(String userEmail);
    List<Booking> findByFacilityOwnerEmail(String ownerEmail);
}

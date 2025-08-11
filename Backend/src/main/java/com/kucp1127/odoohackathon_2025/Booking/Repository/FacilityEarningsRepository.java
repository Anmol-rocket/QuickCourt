package com.kucp1127.odoohackathon_2025.Booking.Repository;


import com.kucp1127.odoohackathon_2025.Booking.Model.FacilityEarnings;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FacilityEarningsRepository extends JpaRepository<FacilityEarnings, String> {
}

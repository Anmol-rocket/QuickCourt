package com.kucp1127.odoohackathon_2025.Refund.Repository;

import com.kucp1127.odoohackathon_2025.Refund.Model.RefundModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface RefundRepository extends JpaRepository<RefundModel, Long> {
    List<RefundModel> findByStatus(String status);
    List<RefundModel> findByOwnerMail(String ownerMail);
    List<RefundModel> findByUserEmail(String userEmail);
    List<RefundModel> findByBookingId(Long bookingId);
}

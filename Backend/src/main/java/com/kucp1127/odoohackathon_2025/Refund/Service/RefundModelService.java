package com.kucp1127.odoohackathon_2025.Refund.Service;

import com.kucp1127.odoohackathon_2025.Booking.Model.Booking;
import com.kucp1127.odoohackathon_2025.Booking.Repository.BookingRepository;
import com.kucp1127.odoohackathon_2025.EmailService.EmailService;
import com.kucp1127.odoohackathon_2025.Refund.Model.RefundModel;
import com.kucp1127.odoohackathon_2025.Refund.Repository.RefundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class RefundModelService {

    private final RefundRepository refundRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    public RefundModelService(RefundRepository refundRepository) {
        this.refundRepository = refundRepository;
    }

    public List<RefundModel> getAllRefunds() {
        return refundRepository.findAll();
    }

    public List<RefundModel> getRefundsByStatus(String status) {
        return refundRepository.findByStatus(status);
    }

    public List<RefundModel> getRefundsByOwner(String ownerMail) {
        return refundRepository.findByOwnerMail(ownerMail);
    }

    public List<RefundModel> getRefundsByUser(String userEmail) {
        return refundRepository.findByUserEmail(userEmail);
    }

    public RefundModel getRefundById(Long id) {
        return refundRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Refund not found with id: " + id));
    }

    public RefundModel createRefund(RefundModel refund) {
        if (refund.getStatus() == null) refund.setStatus("pending");
        return refundRepository.save(refund);
    }



    public void deleteRefund(Long id) {
        if (!refundRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Refund not found with id: " + id);
        }
        refundRepository.deleteById(id);
    }

    /** Mark refund as processed ("done"). Returns updated model. */
    @Transactional
    public RefundModel processRefund(Long id) {
        RefundModel refund = getRefundById(id);
        if ("done".equalsIgnoreCase(refund.getStatus())) {
            // already done — you can choose to throw or just return
            return refund;
        }
        refund.setStatus("done");

        emailService.sendSimpleEmail(refund.getUserEmail(),
                "Regarding Processing of Refund",
                "Dear User Your amount has been refunded...");


        // any additional business logic (refund payment call, notification) goes here
        return refundRepository.save(refund);
    }

    public Object getBookingDetailsByRefundId(Long refundId) {
        Optional<RefundModel> refundModel = refundRepository.findById(refundId);
        if (refundModel.isPresent()) {
            RefundModel refund = refundModel.get();
            Optional<Booking> booking = bookingRepository.findById(refund.getBookingId());
            return booking.orElse(null);
        }
        return null;
    }
}

package com.kucp1127.odoohackathon_2025.Refund.Controller;

import com.kucp1127.odoohackathon_2025.Refund.Model.RefundModel;
import com.kucp1127.odoohackathon_2025.Refund.Service.RefundModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/refunds")
public class RefundController {

    private final RefundModelService refundService;

    @Autowired
    public RefundController(RefundModelService refundService) {
        this.refundService = refundService;
    }

    @GetMapping
    public ResponseEntity<List<RefundModel>> getAllRefunds() {
        return ResponseEntity.ok(refundService.getAllRefunds());
    }

    @GetMapping("/pending")
    public ResponseEntity<List<RefundModel>> getPendingRefunds() {
        return ResponseEntity.ok(refundService.getRefundsByStatus("pending"));
    }

    // changed to request param
    @GetMapping("/owner")
    public ResponseEntity<List<RefundModel>> getRefundsByOwner(@RequestParam String ownerMail) {
        return ResponseEntity.ok(refundService.getRefundsByOwner(ownerMail));
    }

    // changed to request param
    @GetMapping("/user")
    public ResponseEntity<List<RefundModel>> getRefundsByUser(@RequestParam String userEmail) {
        return ResponseEntity.ok(refundService.getRefundsByUser(userEmail));
    }

    // changed to request param
    @GetMapping("/byId")
    public ResponseEntity<RefundModel> getById(@RequestParam Long id) {
        return ResponseEntity.ok(refundService.getRefundById(id));
    }

    @PostMapping
    public ResponseEntity<RefundModel> createRefund(@RequestBody RefundModel refund) {
        RefundModel created = refundService.createRefund(refund);
        return ResponseEntity.status(201).body(created);
    }

    @PostMapping("/process")
    public ResponseEntity<RefundModel> processRefund(@RequestParam Long id) {
        RefundModel processed = refundService.processRefund(id);
        return ResponseEntity.ok(processed);
    }

    @DeleteMapping
    public ResponseEntity<Void> deleteRefund(@RequestParam Long id) {
        refundService.deleteRefund(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/bookingDetails")
    public ResponseEntity<?> getBookingDetailsByRefundId(@RequestParam Long refundId) {
        // TODO: implement fetching booking details using refundId
        return ResponseEntity.ok(refundService.getBookingDetailsByRefundId(refundId));
    }
}

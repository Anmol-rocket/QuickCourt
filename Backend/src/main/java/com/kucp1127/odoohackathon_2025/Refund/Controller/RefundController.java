package com.kucp1127.odoohackathon_2025.Refund.Controller;

import com.kucp1127.odoohackathon_2025.Refund.Model.RefundModel;
import com.kucp1127.odoohackathon_2025.Refund.Service.RefundModelService;
import org.springframework.beans.factory.annotation.Autowired;
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

    @GetMapping("/owner/{ownerMail}")
    public ResponseEntity<List<RefundModel>> getRefundsByOwner(@PathVariable String ownerMail) {
        return ResponseEntity.ok(refundService.getRefundsByOwner(ownerMail));
    }

    @GetMapping("/user/{userEmail}")
    public ResponseEntity<List<RefundModel>> getRefundsByUser(@PathVariable String userEmail) {
        return ResponseEntity.ok(refundService.getRefundsByUser(userEmail));
    }

    @GetMapping("/{id}")
    public ResponseEntity<RefundModel> getById(@PathVariable Long id) {
        return ResponseEntity.ok(refundService.getRefundById(id));
    }

    @PostMapping
    public ResponseEntity<RefundModel> createRefund(@RequestBody RefundModel refund) {
        RefundModel created = refundService.createRefund(refund);
        return ResponseEntity.status(201).body(created);
    }


    @PostMapping("/{id}/process")
    public ResponseEntity<RefundModel> processRefund(@PathVariable Long id) {
        RefundModel processed = refundService.processRefund(id);
        return ResponseEntity.ok(processed);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRefund(@PathVariable Long id) {
        refundService.deleteRefund(id);
        return ResponseEntity.noContent().build();
    }
}

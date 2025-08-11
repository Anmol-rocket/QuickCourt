package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Controller;// VenueController.java

import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.DTO.VenueUpdateRequest;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Service.VenueService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model.Venue;

import java.util.Optional;

@RestController
@RequestMapping("/api/venues")
public class VenueController {
    private final VenueService venueService;

    public VenueController(VenueService venueService) {
        this.venueService = venueService;
    }

    @PostMapping
    public ResponseEntity<?> createVenue(@RequestBody Venue venue, @RequestParam String ownerEmail) {
        Venue created = venueService.createVenueForOwner(venue, ownerEmail);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getVenue(@PathVariable Long id) {
        return venueService.getVenue(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<?> getAllVenue() {
        return ResponseEntity.ok(venueService.getAllVenue());
    }

    @GetMapping("/allVenues/{ownerEmail}")
    public ResponseEntity<?> getAllVenues(@PathVariable String ownerEmail) {
        return ResponseEntity.ok(venueService.getVenuesByOwnerEmail(ownerEmail));
    }

    @DeleteMapping("/owners/{email}/venues/{id}")
    public ResponseEntity<Void> deleteVenue(@PathVariable String email, @PathVariable Long id) {
        venueService.deleteVenueByRemovingFromOwner(email, id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{venueId}")
    public ResponseEntity<Venue> updateVenue(@PathVariable Long venueId,
                                             @RequestBody VenueUpdateRequest req) {
        Optional<Venue> updated = venueService.updateVenue(venueId, req);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/verify/venueId")
    public ResponseEntity<Venue> verifyVenue(@PathVariable Long venueId) {
        return ResponseEntity.ok(venueService.verify(venueId));
    }

}

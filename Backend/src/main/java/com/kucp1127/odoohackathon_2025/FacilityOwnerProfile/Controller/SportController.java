package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Controller;// SportController.java

import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.DTO.SportUpdateRequest;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Service.SportService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model.Sport;

import java.util.Optional;

@RestController
@RequestMapping("/api/sports")
public class SportController {
    private final SportService sportService;

    public SportController(SportService sportService) {
        this.sportService = sportService;
    }

    @PostMapping("/venue/{venueId}")
    public ResponseEntity<?> addSport(@PathVariable Long venueId, @RequestBody Sport sport) {
        Sport saved = sportService.addSportToVenue(venueId, sport);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/venue/{venueId}")
    public ResponseEntity<?> listByVenue(@PathVariable Long venueId) {
        return ResponseEntity.ok(sportService.getSportsForVenue(venueId));
    }

    @DeleteMapping("/{sportId}/venue/{venueId}")
    public ResponseEntity<Void> deleteSport(@PathVariable Long venueId,
                                            @PathVariable Long sportId,
                                            @RequestParam String ownerEmail) {
        sportService.deleteSport(venueId, sportId, ownerEmail);
        return ResponseEntity.noContent().build(); // always 204
    }


    @PutMapping("/{sportId}/venue")
    public ResponseEntity<Sport> updateSport(
                                             @PathVariable Long sportId,
                                             @RequestBody SportUpdateRequest req) {
        Optional<Sport> updated = sportService.updateSport(sportId, req);
        return updated.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSport(@PathVariable Long id) {
        return ResponseEntity.ok(sportService.getSport(id));
    }


}

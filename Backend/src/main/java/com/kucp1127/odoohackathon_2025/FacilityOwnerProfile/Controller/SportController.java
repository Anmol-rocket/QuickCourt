package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Controller;// SportController.java

import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Service.SportService;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model.Sport;

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
}

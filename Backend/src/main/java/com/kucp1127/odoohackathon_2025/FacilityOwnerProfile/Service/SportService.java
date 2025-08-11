package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Service;// SportService.java

import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.DTO.SportUpdateRequest;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository.CommentRepository;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository.SportRepository;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository.VenueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model.*;

@Service
public class SportService {
    private final SportRepository sportRepository;
    private final VenueRepository venueRepository;
    private final CommentRepository commentRepository;

    public SportService(SportRepository sportRepository,
                        VenueRepository venueRepository,
                        CommentRepository commentRepository) {
        this.sportRepository = sportRepository;
        this.venueRepository = venueRepository;
        this.commentRepository = commentRepository;
    }


    @Transactional
    public Sport addSportToVenue(Long venueId, Sport sport) {
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new IllegalArgumentException("Venue not found: " + venueId));
        sport.setVenueId(venueId);
        Sport sport1 = sportRepository.save(sport);
        venue.getSportIds().add(sport1.getId());
        sportRepository.save(sport);
        return sport;
    }

    public List<Sport> getSportsForVenue(Long venueId) {
        return sportRepository.findByVenueId(venueId);
    }


    @Transactional
    public boolean deleteSport(Long venueId, Long sportId, String ownerEmail) {
        Optional<Venue> venue = venueRepository.findById(venueId);
        if (venue.isPresent()) {
            venue.get().getSportIds().remove(sportId);
            venueRepository.save(venue.get());
            sportRepository.deleteById(sportId);
            return true;
        }
        return false;
    }


    @Transactional
    public Optional<Sport> updateSport(Long sportId, SportUpdateRequest req) {
        Optional<Sport> opt = sportRepository.findById(sportId);
        if (opt.isEmpty()) return Optional.empty();

        Sport sport = opt.get();

        // apply partial updates
        if (req.name != null) sport.setName(req.name);
        if (req.type != null) sport.setType(req.type);
        if (req.pricePerHour != null) sport.setPricePerHour(req.pricePerHour);
        if (req.operatingHours != null) sport.setOperatingHours(req.operatingHours);

        Sport saved = sportRepository.save(sport);
        return Optional.of(saved);
    }

}

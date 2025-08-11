package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Service;// SportService.java

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
        sport.setVenue(venue); // owning side
        venue.getSports().add(sport); // keep both sides
        sportRepository.save(sport);
        venueRepository.save(venue);
        return sport;
    }

    public List<Sport> getSportsForVenue(Long venueId) {
        return sportRepository.findByVenueId(venueId);
    }

    @Transactional
    public void recomputeAverageRating(Long sportId) {
        Double avg = commentRepository.findAverageRatingBySportId(sportId);
        double value = (avg == null) ? 0.0 : avg;

        // round to 2 decimals
        double rounded = BigDecimal.valueOf(value)
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();

        sportRepository.findById(sportId).ifPresent(s -> {
            s.setAverageRating(rounded);
            sportRepository.save(s);
        });
    }

}

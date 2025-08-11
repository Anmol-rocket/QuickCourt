package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Service;

import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository.FacilityOwnerProfileRepository;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository.VenueRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Model.*;

@Service
public class VenueService {
    private final VenueRepository venueRepository;
    private final FacilityOwnerProfileRepository profileRepository; // your FacilityOwnerProfile repo

    public VenueService(VenueRepository venueRepository, FacilityOwnerProfileRepository profileRepository) {
        this.venueRepository = venueRepository;
        this.profileRepository = profileRepository;
    }

    @Transactional
    public Venue createVenueForOwner(Venue venue, String ownerEmail) {
        FacilityOwnerProfile owner = profileRepository.findById(ownerEmail)
            .orElseThrow(() -> new IllegalArgumentException("Owner not found: " + ownerEmail));

        venue.setOwnerProfile(owner);
        owner.getVenues().add(venue);
        profileRepository.save(owner);
        return venue;
    }

    public Optional<Venue> getVenue(Long id) {
        return venueRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Venue> getVenuesByOwnerEmail(String ownerEmail) {
        return profileRepository.findById(ownerEmail)
                .map(FacilityOwnerProfile::getVenues)
                .orElse(Collections.emptyList());
    }

    @Transactional
    public void deleteVenueByRemovingFromOwner(String ownerEmail, Long venueId) {
        FacilityOwnerProfile owner = profileRepository.findById(ownerEmail)
                .orElseThrow(() -> new EntityNotFoundException("Owner not found"));

        boolean removed = owner.getVenues().removeIf(v -> v.getId().equals(venueId));
        if (!removed) {
            throw new EntityNotFoundException("Venue not found for owner");
        }
        // because of cascade = ALL + orphanRemoval = true, saving owner will delete the removed venue
        profileRepository.save(owner);
    }



    // other helpers: list venues, update venue, delete venue...
}
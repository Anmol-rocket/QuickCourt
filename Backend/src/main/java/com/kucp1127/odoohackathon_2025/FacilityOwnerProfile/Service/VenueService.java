package com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Service;

import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.DTO.VenueUpdateRequest;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository.FacilityOwnerProfileRepository;
import com.kucp1127.odoohackathon_2025.FacilityOwnerProfile.Repository.VenueRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
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
        if (venue.getName() == null || venue.getName().isBlank()) {
            throw new IllegalArgumentException("Venue.name is required");
        }

        FacilityOwnerProfile owner = profileRepository.findById(ownerEmail)
                .orElseThrow(() -> new IllegalArgumentException("Owner not found: " + ownerEmail));

        venue.setOwnerMail(ownerEmail);
        Venue venue1 = venueRepository.save(venue);
        owner.getFacilityIds().add(venue1.getId());
        profileRepository.save(owner);
        return venue1;
    }


    public Optional<Venue> getVenue(Long id) {
        return venueRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<List<Venue>> getVenuesByOwnerEmail(String ownerEmail) {
        return venueRepository.findByOwnerMail(ownerEmail);
    }

    @Transactional
    public void deleteVenueByRemovingFromOwner(String ownerEmail, Long venueId) {
        Optional<FacilityOwnerProfile> facilityOwnerProfile = profileRepository.findById(ownerEmail);
        if(!facilityOwnerProfile.isPresent()) {
            throw new EntityNotFoundException("Owner not found: " + ownerEmail);
        }
        else{
            facilityOwnerProfile.get().getFacilityIds().remove(venueId);
            profileRepository.save(facilityOwnerProfile.get());
            venueRepository.deleteById(venueId);
        }
    }


    @Transactional
    public Optional<Venue> updateVenue(Long venueId, VenueUpdateRequest req) {
        Optional<Venue> opt = venueRepository.findById(venueId);
        if (opt.isEmpty()) return Optional.empty();

        Venue venue = opt.get();
        if (req.name != null) venue.setName(req.name);
        if (req.description != null) venue.setDescription(req.description);
        if (req.address != null) venue.setAddress(req.address);
        if (req.photoUrls != null) venue.setPhotoUrls(new ArrayList<>(req.photoUrls));
        if (req.amenities != null) venue.setAmenities(new ArrayList<>(req.amenities));

        return Optional.of(venueRepository.save(venue));
    }

    public Object getAllVenue() {
        return venueRepository.findAll();
    }

    public Venue verify(Long venueId) {
        Optional<Venue> venue = venueRepository.findById(venueId);
        if (venue.isEmpty()) return null;
        venue.get().setVerified(true);
        venueRepository.save(venue.get());
        return venue.get();
    }

}
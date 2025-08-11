package com.kucp1127.odoohackathon_2025.Booking.Service;

import com.kucp1127.odoohackathon_2025.Booking.DTO.*;
import com.kucp1127.odoohackathon_2025.Booking.Model.*;
import com.kucp1127.odoohackathon_2025.Booking.Repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.stream.Collectors;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FacilityEarningsRepository earningsRepository;

    public BookingService(BookingRepository bookingRepository,
                          FacilityEarningsRepository earningsRepository) {
        this.bookingRepository = bookingRepository;
        this.earningsRepository = earningsRepository;
    }

    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO request) {
        if (request.getSlots() == null || request.getSlots().isEmpty()) {
            throw new IllegalArgumentException("At least one slot required.");
        }

        Booking booking = new Booking();
        booking.setSportId(request.getSportId());
        booking.setVenueId(request.getVenueId());
        booking.setFacilityOwnerEmail(request.getFacilityOwnerEmail());
        booking.setUserEmail(request.getUserEmail());
        booking.setStatus("CONFIRMED");
        booking.setCreatedAt(LocalDateTime.now());
        booking.setUpdatedAt(LocalDateTime.now());
        booking.setTotalPrice(BigDecimal.ZERO);

        for (SlotDTO sd : request.getSlots()) {
            if (sd.getStartDateTime() == null || sd.getEndDateTime() == null) {
                throw new IllegalArgumentException("Slot start and end are required.");
            }
            if (!sd.getEndDateTime().isAfter(sd.getStartDateTime())) {
                throw new IllegalArgumentException("Each slot end must be after start.");
            }
            SlotPeriod sp = new SlotPeriod(sd.getStartDateTime(), sd.getEndDateTime(), sd.getPrice());
            booking.addSlot(sp);
        }

        Booking saved = bookingRepository.save(booking);

        // update facility earnings (simple additive)
        BigDecimal sum = saved.getTotalPrice() == null ? BigDecimal.ZERO : saved.getTotalPrice();
        FacilityEarnings earnings = earningsRepository.findById(saved.getFacilityOwnerEmail())
                .orElseGet(() -> new FacilityEarnings(saved.getFacilityOwnerEmail(), BigDecimal.ZERO, LocalDateTime.now(), null));
        earnings.setTotalEarnings(earnings.getTotalEarnings().add(sum));
        earnings.setLastUpdated(LocalDateTime.now());
        earningsRepository.save(earnings);

        return toResponseDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<SlotDTO> getBookedSlotsForVenueSport(Long venueId, Long sportId) {
        List<Booking> bookings = bookingRepository.findByVenueIdAndSportId(venueId, sportId);
        return bookings.stream()
                .flatMap(b -> b.getSlots().stream())
                .map(sp -> {
                    SlotDTO sd = new SlotDTO();
                    sd.setStartDateTime(sp.getStartDateTime());
                    sd.setEndDateTime(sp.getEndDateTime());
                    sd.setPrice(sp.getPrice());
                    return sd;
                })
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getBookingsByUser(String userEmail){
        return bookingRepository.findByUserEmail(userEmail).stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BookingResponseDTO> getBookingsByOwner(String ownerEmail){
        return bookingRepository.findByFacilityOwnerEmail(ownerEmail).stream().map(this::toResponseDTO).collect(Collectors.toList());
    }

    private BookingResponseDTO toResponseDTO(Booking b){
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(b.getId());
        dto.setSportId(b.getSportId());
        dto.setVenueId(b.getVenueId());
        dto.setFacilityOwnerEmail(b.getFacilityOwnerEmail());
        dto.setUserEmail(b.getUserEmail());
        dto.setTotalPrice(b.getTotalPrice());
        dto.setStatus(b.getStatus());
        dto.setCreatedAt(b.getCreatedAt());
        dto.setSlots(b.getSlots().stream().map(sp -> {
            SlotDTO sd = new SlotDTO();
            sd.setStartDateTime(sp.getStartDateTime());
            sd.setEndDateTime(sp.getEndDateTime());
            sd.setPrice(sp.getPrice());
            return sd;
        }).collect(Collectors.toList()));
        return dto;
    }

    public Boolean cancelBooking(Long id) {

        Booking booking = bookingRepository.findById(id).orElse(null);
        if (booking == null) {
            return false;
        }
        FacilityEarnings fee = earningsRepository.findById(booking.getFacilityOwnerEmail()).orElse(null);
        if (fee == null) {
            return false;
        }
        fee.setTotalEarnings(
                fee.getTotalEarnings().subtract(booking.getTotalPrice())
        );
        fee.setLastUpdated(LocalDateTime.now());
        earningsRepository.save(fee);
        return true;

    }
}

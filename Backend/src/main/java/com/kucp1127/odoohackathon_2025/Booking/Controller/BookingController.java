package com.kucp1127.odoohackathon_2025.Booking.Controller;

import com.kucp1127.odoohackathon_2025.Booking.DTO.*;
import com.kucp1127.odoohackathon_2025.Booking.Model.FacilityEarnings;
import com.kucp1127.odoohackathon_2025.Booking.Repository.FacilityEarningsRepository;
import com.kucp1127.odoohackathon_2025.Booking.Service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final FacilityEarningsRepository earningsRepository;

    public BookingController(BookingService bookingService, FacilityEarningsRepository earningsRepository) {
        this.bookingService = bookingService;
        this.earningsRepository = earningsRepository;
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> create(@RequestBody BookingRequestDTO request){
        return ResponseEntity.ok(bookingService.createBooking(request));
    }

    // optional helper: frontend may call this to get existing booked slots (you said frontend checks availability)
    @GetMapping("/slots")
    public ResponseEntity<List<SlotDTO>> getBookedSlots(@RequestParam Long venueId, @RequestParam Long sportId){
        return ResponseEntity.ok(bookingService.getBookedSlotsForVenueSport(venueId, sportId));
    }

    @GetMapping("/user/{email}")
    public ResponseEntity<List<BookingResponseDTO>> byUser(@PathVariable String email){
        return ResponseEntity.ok(bookingService.getBookingsByUser(email));
    }

    @GetMapping("/owner/{email}")
    public ResponseEntity<List<BookingResponseDTO>> byOwner(@PathVariable String email){
        return ResponseEntity.ok(bookingService.getBookingsByOwner(email));
    }

    @GetMapping("/earnings/{ownerEmail}")
    public ResponseEntity<FacilityEarnings> getEarnings(@PathVariable String ownerEmail){
        FacilityEarnings fe = earningsRepository.findById(ownerEmail)
                .orElse(new FacilityEarnings(ownerEmail, java.math.BigDecimal.ZERO, java.time.LocalDateTime.now(), null));
        return ResponseEntity.ok(fe);
    }
}

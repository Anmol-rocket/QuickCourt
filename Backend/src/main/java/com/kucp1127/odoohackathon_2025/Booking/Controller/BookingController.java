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


    @GetMapping("/slots")
    public ResponseEntity<List<SlotDTO>> getBookedSlots(@RequestParam Long venueId, @RequestParam Long sportId){
        return ResponseEntity.ok(bookingService.getBookedSlotsForVenueSport(venueId, sportId));
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<?> get(@PathVariable String id){
        return ResponseEntity.ok(bookingService.getBookingsByUser(id));
    }


    @GetMapping("/earnings/{ownerEmail}")
    public ResponseEntity<FacilityEarnings> getEarnings(@PathVariable String ownerEmail){
        FacilityEarnings fe = earningsRepository.findById(ownerEmail)
            .orElse(new FacilityEarnings(ownerEmail, java.math.BigDecimal.ZERO, java.time.LocalDateTime.now(), null));
        return ResponseEntity.ok(fe);
    }

    @DeleteMapping("/cancelBooking/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id){
        return ResponseEntity.ok(bookingService.cancelBooking(id));
    }
}

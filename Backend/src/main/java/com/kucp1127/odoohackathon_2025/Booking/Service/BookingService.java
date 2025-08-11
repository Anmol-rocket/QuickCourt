package com.kucp1127.odoohackathon_2025.Booking.Service;


import com.kucp1127.odoohackathon_2025.Booking.DTO.BookingRequestDTO;
import com.kucp1127.odoohackathon_2025.Booking.DTO.BookingResponseDTO;
import com.kucp1127.odoohackathon_2025.Booking.DTO.SlotDTO;
import com.kucp1127.odoohackathon_2025.Booking.Model.Booking;
import com.kucp1127.odoohackathon_2025.Booking.Model.FacilityEarnings;
import com.kucp1127.odoohackathon_2025.Booking.Model.MonthEarning;
import com.kucp1127.odoohackathon_2025.Booking.Model.SlotPeriod;
import com.kucp1127.odoohackathon_2025.Booking.Repository.BookingRepository;
import com.kucp1127.odoohackathon_2025.Booking.Repository.FacilityEarningsRepository;
import com.kucp1127.odoohackathon_2025.EmailService.EmailService;
import com.kucp1127.odoohackathon_2025.Refund.Model.RefundModel;
import com.kucp1127.odoohackathon_2025.Refund.Service.RefundModelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final FacilityEarningsRepository earningsRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private RefundModelService refundModelService;

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



        // accumulate total price if your Booking.addSlot doesn't already do it
        BigDecimal total = BigDecimal.ZERO;
        for (SlotDTO sd : request.getSlots()) {
            if (sd.getStartDateTime() == null || sd.getEndDateTime() == null) {
                throw new IllegalArgumentException("Slot start and end are required.");
            }
            if (!sd.getEndDateTime().isAfter(sd.getStartDateTime())) {
                throw new IllegalArgumentException("Each slot end must be after start.");
            }
            SlotPeriod sp = new SlotPeriod(sd.getStartDateTime(), sd.getEndDateTime(), sd.getPrice());
            booking.addSlot(sp);

            if (sd.getPrice() != null) {
                total = total.add(sd.getPrice());
            }
        }
        booking.setTotalPrice(total);

        Booking saved = bookingRepository.save(booking);

        LocalDateTime timestamp = saved.getCreatedAt() != null ? saved.getCreatedAt() : LocalDateTime.now();
        int monthIndex = timestamp.getMonthValue() - 1; // 0..11
        BigDecimal amount = saved.getTotalPrice() == null ? BigDecimal.ZERO : saved.getTotalPrice();

        FacilityEarnings earnings = earningsRepository.findById(request.getFacilityOwnerEmail()).orElse(null);

        if (earnings == null) {
            FacilityEarnings f = new FacilityEarnings();
            f.setFacilityOwnerEmail(request.getFacilityOwnerEmail());

            MonthEarning m = new MonthEarning();
            m.setMonth(monthIndex);
            m.setEarning(amount);
            m.setRecordedAt(timestamp);

            List<MonthEarning> months = new ArrayList<>();
            months.add(m);
            f.setMonthlyEarnings(months);
            earningsRepository.save(f);
        } else {
            List<MonthEarning> months = earnings.getMonthlyEarnings();
            if (months == null) {
                months = new ArrayList<>();
            }

            MonthEarning target = null;
            for (MonthEarning me : months) {
                if (me != null && me.getMonth() != null && me.getMonth().intValue() == monthIndex) {
                    target = me;
                    break;
                }
            }

            if (target != null) {
                BigDecimal current = target.getEarning() == null ? BigDecimal.ZERO : target.getEarning();
                target.setEarning(current.add(amount));
                target.setRecordedAt(timestamp);
            } else {
                MonthEarning newMe = new MonthEarning();
                newMe.setMonth(monthIndex);
                newMe.setEarning(amount);
                newMe.setRecordedAt(timestamp);
                months.add(newMe);
            }

            earnings.setMonthlyEarnings(months);
            earningsRepository.save(earnings);
        }
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
        RefundModel refundModel =  new RefundModel();
        refundModel.setBookingId(id);
        refundModel.setStatus("pending");
        refundModel.setUserEmail(booking.getUserEmail());
        refundModel.setOwnerMail(booking.getFacilityOwnerEmail());
        refundModel.setAmount(String.valueOf(booking.getTotalPrice()));
        refundModelService.createRefund(refundModel);

        emailService.sendSimpleEmail(booking.getUserEmail(),
                "Regarding Cancellation of Booking",
                "Dear User , Your Booking has been Cancelled and is in Pending state ," +
                        " soon your Booking will be cancelled and refund will be initiated");



        booking.setStatus("Cancelled");
        bookingRepository.save(booking);
        return true;

    }

    public List<Integer> getMonthlyTrends(String ownerEmail) {
        List<Booking> bookings = bookingRepository.findByFacilityOwnerEmail(ownerEmail);

        // initialize a list of 12 zeros
        List<Integer> counts = new ArrayList<>(Collections.nCopies(12, 0));

        if (bookings == null || bookings.isEmpty()) {
            return counts;
        }

        for (Booking b : bookings) {
            if (b == null) continue;
            LocalDateTime createdAt = b.getCreatedAt();
            if (createdAt == null) continue;

            int monthIndex = createdAt.getMonthValue() - 1; // 0..11
            if (monthIndex >= 0 && monthIndex < 12) {
                counts.set(monthIndex, counts.get(monthIndex) + 1);
            }
        }

        return counts;
    }

    public List<List<Integer>> getMonthlyTrendsofAmonth(String ownerEmail) {
        List<Booking> bookings = bookingRepository.findByFacilityOwnerEmail(ownerEmail);

        // create 12 empty lists (index 0 = January, ... 11 = December)
        List<List<Integer>> months = new ArrayList<>(12);
        for (int i = 0; i < 12; i++) {
            months.add(new ArrayList<>());
        }

        if (bookings == null || bookings.isEmpty()) {
            return months;
        }

        for (Booking b : bookings) {
            if (b == null) continue;
            LocalDateTime createdAt = b.getCreatedAt();
            if (createdAt == null) continue;

            int monthIndex = createdAt.getMonthValue() - 1; // 0..11
            int dayOfMonth = createdAt.getDayOfMonth();    // 1..31

            if (monthIndex >= 0 && monthIndex < 12) {
                months.get(monthIndex).add(dayOfMonth);
            }
        }

        return months;
    }

    public Object getBookingByDate(String ownerEmail) {
        return null;
    }
}

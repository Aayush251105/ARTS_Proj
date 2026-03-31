package com.team26.backend.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

import com.team26.backend.model.Booking;
import com.team26.backend.model.Flight;
import com.team26.backend.repository.BookingRepository;
import com.team26.backend.repository.FlightRepository;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    // GET bookings by user
    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUserId(@PathVariable Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    // CANCEL a booking
    @DeleteMapping("/{bookId}")
    public ResponseEntity<?> deleteBooking(@PathVariable Long bookId) {
        Booking booking = bookingRepository.findById(bookId).orElse(null);
        if (booking != null && !"CANCELLED".equals(booking.getStatus())) {
            booking.setStatus("CANCELLED");
            bookingRepository.save(booking);
            
            // Insert into Cancellations table (e.g. 80% refund logic or simple calculation)
            BigDecimal refundAmt = booking.getBookingPrice() != null 
                ? booking.getBookingPrice().multiply(new BigDecimal("0.80")) 
                : BigDecimal.ZERO;
                
            jdbcTemplate.update("INSERT INTO Cancellations (BookID, RefundAmt) VALUES (?, ?)", 
                bookId, refundAmt);
                
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Count bookings where dateOfFlight == today
    @GetMapping("/count/today")
    public long countBookingsToday() {
        return bookingRepository.countByDateOfFlightAndStatus(LocalDate.now(), "CONFIRMED");
    }

    /**
     * GET /api/bookings/occupancy?flightId=1&startDate=2026-04-01&endDate=2026-04-10
     *
     * Returns occupancy statistics for the given flight across the date range.
     * Seat class distribution: First=20%, Business=20%, Economy=60% of total capacity.
     * Multi-day: total pool = numSeats × N days.
     */
    @GetMapping("/occupancy")
    public ResponseEntity<Map<String, Object>> getOccupancyStats(
            @RequestParam Integer flightId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        // Fetch flight to get total seat capacity
        Flight flight = flightRepository.findById(flightId).orElse(null);
        if (flight == null) {
            return ResponseEntity.notFound().build();
        }

        int numSeats = flight.getNumSeats();
        long numDays = ChronoUnit.DAYS.between(startDate, endDate) + 1; // inclusive

        // Seat class distribution per day
        int firstPerDay = (int) Math.round(numSeats * 0.20);
        int businessPerDay = (int) Math.round(numSeats * 0.20);
        int economyPerDay = numSeats - firstPerDay - businessPerDay; // remainder to economy

        // Total available across the date range
        long totalAvailable = numSeats * numDays;
        long firstAvailable = firstPerDay * numDays;
        long businessAvailable = businessPerDay * numDays;
        long economyAvailable = economyPerDay * numDays;

        // Fetch matching bookings
        List<Booking> bookings = bookingRepository.findByFlightAndDateRange(flightId, startDate, endDate);

        // Sum occupied seats by class
        long totalOccupied = 0;
        long firstOccupied = 0;
        long businessOccupied = 0;
        long economyOccupied = 0;

        for (Booking b : bookings) {
            int seats = b.getNumSeatsBook() != null ? b.getNumSeatsBook() : 0;
            totalOccupied += seats;

            String seatClass = b.getSeatClass();
            if (seatClass != null) {
                switch (seatClass.toLowerCase()) {
                    case "first":
                        firstOccupied += seats;
                        break;
                    case "business":
                        businessOccupied += seats;
                        break;
                    default:
                        economyOccupied += seats;
                        break;
                }
            } else {
                economyOccupied += seats;
            }
        }

        // Build response
        Map<String, Object> stats = new HashMap<>();
        stats.put("flightId", flightId);
        stats.put("fromLocation", flight.getFromLocation());
        stats.put("toLocation", flight.getToLocation());
        stats.put("numSeatsPerDay", numSeats);
        stats.put("numDays", numDays);

        stats.put("totalAvailable", totalAvailable);
        stats.put("totalOccupied", totalOccupied);
        stats.put("totalOccupancyRate", totalAvailable > 0
                ? Math.round((double) totalOccupied / totalAvailable * 10000.0) / 100.0
                : 0);

        stats.put("firstAvailable", firstAvailable);
        stats.put("firstOccupied", firstOccupied);
        stats.put("firstOccupancyRate", firstAvailable > 0
                ? Math.round((double) firstOccupied / firstAvailable * 10000.0) / 100.0
                : 0);

        stats.put("businessAvailable", businessAvailable);
        stats.put("businessOccupied", businessOccupied);
        stats.put("businessOccupancyRate", businessAvailable > 0
                ? Math.round((double) businessOccupied / businessAvailable * 10000.0) / 100.0
                : 0);

        stats.put("economyAvailable", economyAvailable);
        stats.put("economyOccupied", economyOccupied);
        stats.put("economyOccupancyRate", economyAvailable > 0
                ? Math.round((double) economyOccupied / economyAvailable * 10000.0) / 100.0
                : 0);

        return ResponseEntity.ok(stats);
    }
}
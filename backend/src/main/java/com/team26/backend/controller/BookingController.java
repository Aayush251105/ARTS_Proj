package com.team26.backend.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
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

import com.team26.backend.dto.BookingRequest;
import com.team26.backend.dto.BookingResponse;
import com.team26.backend.dto.PassengerDTO;
import com.team26.backend.model.Booking;
import com.team26.backend.model.Flight;
import com.team26.backend.model.Passenger;
import com.team26.backend.model.Cancellation;
import com.team26.backend.repository.BookingRepository;
import com.team26.backend.repository.FlightRepository;
import com.team26.backend.repository.PassengerRepository;
import com.team26.backend.repository.CancellationRepository;
import com.team26.backend.util.EncryptionUtil;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PassengerRepository passengerRepository;

    @Autowired
    private FlightRepository flightRepository;

    @Autowired
    private CancellationRepository cancellationRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private Map<String, Object> errorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", message);
        response.put("status", "FAILED");
        return response;
    }

    // ✅ CREATE BOOKING WITH PASSENGERS
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest bookingRequest) {
        try {
            System.out.println("📝 Received booking request: " + bookingRequest.getFromLocation() + " -> " + bookingRequest.getToLocation());

            // Validate required fields
            if (bookingRequest.getFlight1() == null) {
                return ResponseEntity.badRequest().body(errorResponse("Flight1 is required"));
            }
            if (bookingRequest.getPassengers() == null || bookingRequest.getPassengers().isEmpty()) {
                return ResponseEntity.badRequest().body(errorResponse("At least one passenger is required"));
            }

            boolean isInternational = Boolean.TRUE.equals(bookingRequest.getIsInternational());
            System.out.println("✈️  International flight: " + isInternational);

            // ✅ Server-side passport validation for international flights
            if (isInternational) {
                for (int i = 0; i < bookingRequest.getPassengers().size(); i++) {
                    PassengerDTO p = bookingRequest.getPassengers().get(i);
                    if (p.getPassport() == null || p.getPassport().trim().isEmpty()) {
                        return ResponseEntity.badRequest().body(
                            errorResponse("Passenger " + (i + 1) + ": Passport is required for international flights")
                        );
                    }
                    if (p.getPassport().trim().length() < 6 || p.getPassport().trim().length() > 20) {
                        return ResponseEntity.badRequest().body(
                            errorResponse("Passenger " + (i + 1) + ": Passport must be 6-20 characters")
                        );
                    }
                }
            }

            // Create Booking
            Booking booking = new Booking();
            booking.setUserId(bookingRequest.getUserId());
            booking.setFlight1(bookingRequest.getFlight1());
            booking.setFlight2(bookingRequest.getFlight2());
            booking.setSeatClass(bookingRequest.getSeatClass());
            booking.setBookingPrice(BigDecimal.valueOf(bookingRequest.getBookingPrice()));
            booking.setFromLocation(bookingRequest.getFromLocation());
            booking.setToLocation(bookingRequest.getToLocation());
            booking.setNumSeatsBook(bookingRequest.getNumSeatsBook());
            booking.setDateOfFlight(LocalDate.parse(bookingRequest.getDateOfFlight()));

            Booking savedBooking = bookingRepository.save(booking);
            System.out.println("✅ Booking saved with ID: " + savedBooking.getBookId());

            // Save Passengers — encrypt passport ONLY for international flights
            for (PassengerDTO passengerDTO : bookingRequest.getPassengers()) {
                Passenger passenger = new Passenger();
                passenger.setBookingId(savedBooking.getBookId());
                passenger.setPassName(passengerDTO.getName());

                // Use string seats directly matching new schema
                if (passengerDTO.getSeatFlight1() != null && !passengerDTO.getSeatFlight1().isEmpty()) {
                    passenger.setSeat1(passengerDTO.getSeatFlight1());
                }
                if (passengerDTO.getSeatFlight2() != null && !passengerDTO.getSeatFlight2().isEmpty()) {
                    passenger.setSeat2(passengerDTO.getSeatFlight2());
                }

                // 🔐 Encrypt passport ONLY for international flights — domestic leaves it null
                if (isInternational && passengerDTO.getPassport() != null && !passengerDTO.getPassport().isEmpty()) {
                    String encryptedPassport = EncryptionUtil.encrypt(passengerDTO.getPassport().trim());
                    passenger.setPassport(encryptedPassport);
                    System.out.println("🔐 Passport encrypted for passenger: " + passengerDTO.getName());
                } else {
                    passenger.setPassport(null); // Domestic: never store passport
                }

                passengerRepository.save(passenger);
                System.out.println("✅ Passenger saved: " + passengerDTO.getName());
            }

            return ResponseEntity.ok(new BookingResponse(
                savedBooking.getBookId(),
                "Booking created successfully!",
                bookingRequest.getPassengers().size()
            ));

        } catch (IllegalArgumentException e) {
            System.err.println("❌ Invalid argument: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(errorResponse("Invalid date format or data: " + e.getMessage()));
        } catch (Exception e) {
            System.err.println("❌ Booking error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(errorResponse("Error creating booking: " + e.getMessage()));
        }
    }
    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUserId(@PathVariable Integer userId) {
        // CHANGED: Now calls the method that checks for cancellation status
        return bookingRepository.findByUserIdWithStatus(userId);
    }

    // CANCEL a booking
    @DeleteMapping("/{bookId}")
    public ResponseEntity<?> deleteBooking(@PathVariable Integer bookId) {
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

    // GET /api/bookings/revenue
    @GetMapping("/revenue")
    public ResponseEntity<Map<String, Object>> getRevenueStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<Booking> confirmedBookings = bookingRepository.findConfirmedBookingsByDateRange(startDate, endDate);
        
        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal firstRevenue = BigDecimal.ZERO;
        BigDecimal businessRevenue = BigDecimal.ZERO;
        BigDecimal econRevenue = BigDecimal.ZERO;
        
        Map<String, BigDecimal> routeRevenue = new HashMap<>(); // Key: Route String, Value: Revenue
        
        for (Booking b : confirmedBookings) {
            BigDecimal price = b.getBookingPrice() != null ? b.getBookingPrice() : BigDecimal.ZERO;
            totalRevenue = totalRevenue.add(price);
            
            String seatClass = b.getSeatClass() != null ? b.getSeatClass().toUpperCase() : "ECONOMY";
            if ("FIRST".equals(seatClass)) firstRevenue = firstRevenue.add(price);
            else if ("BUSINESS".equals(seatClass)) businessRevenue = businessRevenue.add(price);
            else econRevenue = econRevenue.add(price);
            
            String from = b.getFromLocation();
            String to = b.getToLocation();
            String via = b.getVia();
            
            if (via != null && !via.trim().isEmpty()) {
                String route1 = from + " → " + via;
                String route2 = via + " → " + to;
                String route3 = from + " → " + to;
                routeRevenue.put(route1, routeRevenue.getOrDefault(route1, BigDecimal.ZERO).add(price));
                routeRevenue.put(route2, routeRevenue.getOrDefault(route2, BigDecimal.ZERO).add(price));
                routeRevenue.put(route3, routeRevenue.getOrDefault(route3, BigDecimal.ZERO).add(price));
            } else {
                String route = from + " → " + to;
                routeRevenue.put(route, routeRevenue.getOrDefault(route, BigDecimal.ZERO).add(price));
            }
        }
        
        List<Map<String, Object>> routeList = routeRevenue.entrySet().stream()
            .map(e -> {
                Map<String, Object> m = new HashMap<>();
                m.put("route", e.getKey());
                m.put("revenue", e.getValue());
                return m;
            })
            .sorted((m1, m2) -> ((BigDecimal)m2.get("revenue")).compareTo((BigDecimal)m1.get("revenue")))
            .toList();

        Map<String, Object> result = new HashMap<>();
        result.put("totalRevenue", totalRevenue);
        result.put("firstRevenue", firstRevenue);
        result.put("businessRevenue", businessRevenue);
        result.put("econRevenue", econRevenue);
        result.put("totalBookings", confirmedBookings.size());
        result.put("routeRevenue", routeList);
        
        return ResponseEntity.ok(result);
    }

    // GET /api/bookings/passengers
    @GetMapping("/passengers")
    public ResponseEntity<Map<String, Object>> getPassengerLists(
            @RequestParam Integer flightId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        List<Object[]> results = passengerRepository.findPassengersByFlightAndDateRange(flightId, startDate, endDate);
        
        Map<String, List<Map<String, Object>>> groupedPassengers = new java.util.TreeMap<>();

        for (Object[] row : results) {
            Passenger p = (Passenger) row[0];
            Booking b = (Booking) row[1];
            
            String dateStr = b.getDateOfFlight().toString();
            String assignedSeat = "Unassigned";
            
            if (flightId.equals(b.getFlight1())) {
                assignedSeat = p.getSeat1() != null ? p.getSeat1() : "Unassigned";
            } else if (flightId.equals(b.getFlight2())) {
                assignedSeat = p.getSeat2() != null ? p.getSeat2() : "Unassigned";
            }
            
            Map<String, Object> passMap = new HashMap<>();
            passMap.put("passName", p.getPassName());
            passMap.put("assignedSeat", assignedSeat);
            passMap.put("seatClass", b.getSeatClass());
            passMap.put("bookingId", b.getBookId());
            
            groupedPassengers.computeIfAbsent(dateStr, k -> new java.util.ArrayList<>()).add(passMap);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("flightId", flightId);
        response.put("passengersByDate", groupedPassengers);
        
        return ResponseEntity.ok(response);
    }

    // GET /api/bookings/cancellations/stats
    @GetMapping("/cancellations/stats")
    public ResponseEntity<Map<String, Object>> getCancellationStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
            
        List<Object[]> results = cancellationRepository.findCancellationsWithBookingsByDateRange(startDate, endDate);
        
        BigDecimal totalRefund = BigDecimal.ZERO;
        BigDecimal firstRefund = BigDecimal.ZERO;
        BigDecimal businessRefund = BigDecimal.ZERO;
        BigDecimal econRefund = BigDecimal.ZERO;
        
        Map<String, BigDecimal> routeRefund = new HashMap<>();
        
        for (Object[] row : results) {
            Cancellation c = (Cancellation) row[0];
            Booking b = (Booking) row[1];
            
            BigDecimal refund = c.getRefundAmt() != null ? c.getRefundAmt() : BigDecimal.ZERO;
            totalRefund = totalRefund.add(refund);
            
            String seatClass = b.getSeatClass() != null ? b.getSeatClass().toUpperCase() : "ECONOMY";
            if ("FIRST".equals(seatClass)) firstRefund = firstRefund.add(refund);
            else if ("BUSINESS".equals(seatClass)) businessRefund = businessRefund.add(refund);
            else econRefund = econRefund.add(refund);
            
            String from = b.getFromLocation();
            String to = b.getToLocation();
            String via = b.getVia();
            
            if (via != null && !via.trim().isEmpty()) {
                String route1 = from + " → " + via;
                String route2 = via + " → " + to;
                String route3 = from + " → " + to;
                routeRefund.put(route1, routeRefund.getOrDefault(route1, BigDecimal.ZERO).add(refund));
                routeRefund.put(route2, routeRefund.getOrDefault(route2, BigDecimal.ZERO).add(refund));
                routeRefund.put(route3, routeRefund.getOrDefault(route3, BigDecimal.ZERO).add(refund));
            } else {
                String route = from + " → " + to;
                routeRefund.put(route, routeRefund.getOrDefault(route, BigDecimal.ZERO).add(refund));
            }
        }
        
        List<Map<String, Object>> routeList = routeRefund.entrySet().stream()
            .map(e -> {
                Map<String, Object> m = new HashMap<>();
                m.put("route", e.getKey());
                m.put("refund", e.getValue());
                return m;
            })
            .sorted((m1, m2) -> ((BigDecimal)m2.get("refund")).compareTo((BigDecimal)m1.get("refund")))
            .toList();
            
        Map<String, Object> response = new HashMap<>();
        response.put("totalRefund", totalRefund);
        response.put("firstRefund", firstRefund);
        response.put("businessRefund", businessRefund);
        response.put("econRefund", econRefund);
        response.put("totalCancellations", results.size());
        response.put("routeRefund", routeList);
        
        return ResponseEntity.ok(response);
    }
}

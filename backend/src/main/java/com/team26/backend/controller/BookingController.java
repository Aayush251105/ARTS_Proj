package com.team26.backend.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team26.backend.dto.BookingRequest;
import com.team26.backend.dto.BookingResponse;
import com.team26.backend.dto.PassengerDTO;
import com.team26.backend.model.Booking;
import com.team26.backend.model.Passengers;
import com.team26.backend.repository.BookingRepository;
import com.team26.backend.repository.PassengerRepository;
import com.team26.backend.util.EncryptionUtil;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173") // Crucial: Allows React to talk to Java
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private PassengerRepository passengerRepository;

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
                Passengers passenger = new Passengers();
                passenger.setBookingId(savedBooking.getBookId());
                passenger.setPassName(passengerDTO.getName());

                // Convert seat strings to integers
                if (passengerDTO.getSeatFlight1() != null && !passengerDTO.getSeatFlight1().isEmpty()) {
                    try {
                        passenger.setSeat1(Integer.parseInt(passengerDTO.getSeatFlight1()));
                    } catch (NumberFormatException e) {
                        System.err.println("⚠️  Invalid seat number for flight 1: " + passengerDTO.getSeatFlight1());
                    }
                }
                if (passengerDTO.getSeatFlight2() != null && !passengerDTO.getSeatFlight2().isEmpty()) {
                    try {
                        passenger.setSeat2(Integer.parseInt(passengerDTO.getSeatFlight2()));
                    } catch (NumberFormatException e) {
                        System.err.println("⚠️  Invalid seat number for flight 2: " + passengerDTO.getSeatFlight2());
                    }
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

    // ✅ GET BOOKINGS BY USER
    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUserId(@PathVariable Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @DeleteMapping("/{bookId}")
    public void deleteBooking(@PathVariable Long bookId) {
        bookingRepository.deleteById(bookId);
    }
}
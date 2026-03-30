package com.team26.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team26.backend.model.Booking;
import com.team26.backend.repository.BookingRepository;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "http://localhost:5173") // Crucial: Allows React to talk to Java
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    // This defines the URL: http://localhost:8080/api/bookings/user/{id}
    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUserId(@PathVariable Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    @DeleteMapping("/{bookId}")
    public void deleteBooking(@PathVariable Long bookId) {
        bookingRepository.deleteById(bookId);
    }
}
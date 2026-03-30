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
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @GetMapping("/user/{userId}")
    public List<Booking> getBookingsByUserId(@PathVariable Integer userId) {
        // CHANGED: Now calls the method that checks for cancellation status
        return bookingRepository.findByUserIdWithStatus(userId);
    }

    @DeleteMapping("/{bookId}")
    public void deleteBooking(@PathVariable Integer bookId) {
        bookingRepository.deleteById(bookId);
    }
}
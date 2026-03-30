package com.team26.backend.service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.team26.backend.model.Booking;
import com.team26.backend.model.Cancellation;
import com.team26.backend.repository.BookingRepository;
import com.team26.backend.repository.CancellationRepository;

@Service
public class CancellationService {

    @Autowired
    private BookingRepository bookingRepository;
    
    @Autowired
    private CancellationRepository cancellationRepository;

    public BigDecimal calculateRefund(LocalDateTime flightTime, BigDecimal price) {
        LocalDateTime now = LocalDateTime.now();
        Duration duration = Duration.between(now, flightTime);
        long hoursRemaining = duration.toHours();

        double percentage = 0.0;
        if (hoursRemaining >= 48) percentage = 0.75;      // 2+ days
        else if (hoursRemaining >= 24) percentage = 0.50; // 1-2 days
        else if (hoursRemaining >= 12) percentage = 0.25; // 12-24 hours
        else percentage = 0.0;                            // < 12 hours

        return price.multiply(BigDecimal.valueOf(percentage));
    }

    public Cancellation cancelBooking(Integer bookId) {
        Booking booking = bookingRepository.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        LocalDateTime flightTime = booking.getDateOfFlight().atTime(10, 0);
        BigDecimal refundAmount = calculateRefund(flightTime, booking.getBookingPrice());

        Cancellation cancellation = new Cancellation();
        cancellation.setBookId(bookId);
        cancellation.setRefundAmt(refundAmount);
        
        // STEP 1: Save the log
        cancellationRepository.save(cancellation);
        
        // STEP 2: Just return it for now WITHOUT deleting the booking
        // This will prove if the "Save" part works!
        return cancellation;
    }
}
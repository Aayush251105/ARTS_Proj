package com.team26.backend.repository;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.team26.backend.model.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> { 

    // We use a Native Query to perform the LEFT JOIN check
    @Query(value = "SELECT b.BookID, b.UserID, b.SeatClass, b.BookingPrice, " +
                   "b.FromLocation, b.ToLocation, b.DateOfFlight, b.NumSeatsBook, " +
                   "CASE WHEN c.BookID IS NOT NULL THEN 'CANCELLED' ELSE 'CONFIRMED' END as status " +
                   "FROM Booking b " +
                   "LEFT JOIN Cancellations c ON b.BookID = c.BookID " +
                   "WHERE b.UserID = :userId", nativeQuery = true)
    List<Object[]> findBookingsWithStatusRaw(@Param("userId") Integer userId);

    // Helper method to convert the Raw Objects into Booking objects
    default List<Booking> findByUserIdWithStatus(Integer userId) {
        List<Object[]> results = findBookingsWithStatusRaw(userId);
        List<Booking> bookings = new ArrayList<>();
        
        for (Object[] row : results) {
            Booking b = new Booking();
            b.setBookId((Integer) row[0]);
            b.setUserId((Integer) row[1]);
            b.setSeatClass((String) row[2]);
            b.setBookingPrice((BigDecimal) row[3]);
            b.setFromLocation((String) row[4]);
            b.setToLocation((String) row[5]);
            b.setDateOfFlight(((java.sql.Date) row[6]).toLocalDate());
            b.setNumSeatsBook((Integer) row[7]);
            b.setStatus((String) row[8]); // This sets the status field!
            bookings.add(b);
        }
        return bookings;
    }
}
package com.team26.backend.repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.team26.backend.model.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    List<Booking> findByUserId(Integer userId);

    @Query("SELECT c.bookId FROM Cancellation c WHERE c.bookId IN (" +
           "SELECT b.bookId FROM Booking b WHERE b.userId = :userId)")
    List<Integer> findCancelledBookingIdsByUserId(@Param("userId") Integer userId);

    default List<Booking> findByUserIdWithStatus(Integer userId) {
        List<Booking> results = findByUserId(userId);
        Set<Integer> cancelledIds = new HashSet<>(findCancelledBookingIdsByUserId(userId));
        List<Booking> bookings = new ArrayList<>();

        for (Booking source : results) {
            Booking booking = new Booking();
            booking.setBookId(source.getBookId());
            booking.setUserId(source.getUserId());
            booking.setFlight1(source.getFlight1());
            booking.setFlight2(source.getFlight2());
            booking.setSeatClass(source.getSeatClass());
            booking.setBookingPrice(source.getBookingPrice());
            booking.setFromLocation(source.getFromLocation());
            booking.setVia(source.getVia());
            booking.setToLocation(source.getToLocation());
            booking.setDateOfFlight(source.getDateOfFlight());
            booking.setNumSeatsBook(source.getNumSeatsBook());
            booking.setStatus(cancelledIds.contains(source.getBookId()) ? "CANCELLED" : "CONFIRMED");
            bookings.add(booking);
        }

        return bookings;
    }

    long countByDateOfFlightAndStatus(LocalDate dateOfFlight, String status);

    @Query("SELECT b FROM Booking b WHERE (b.flight1 = :flightId OR b.flight2 = :flightId) " +
           "AND b.dateOfFlight >= :startDate AND b.dateOfFlight <= :endDate " +
           "AND b.status = 'CONFIRMED'")
    List<Booking> findByFlightAndDateRange(
            @Param("flightId") Integer flightId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT b FROM Booking b WHERE b.dateOfFlight >= :startDate " +
           "AND b.dateOfFlight <= :endDate AND b.status = 'CONFIRMED'")
    List<Booking> findConfirmedBookingsByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}

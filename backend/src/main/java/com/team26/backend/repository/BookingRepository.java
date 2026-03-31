package com.team26.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.team26.backend.model.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
    long countByDateOfFlightAndStatus(LocalDate dateOfFlight, String status);

    /**
     * Find bookings where flight1 OR flight2 matches the given flightId,
     * AND dateOfFlight falls within the given date range (inclusive),
     * AND status is CONFIRMED.
     */
    @Query("SELECT b FROM Booking b WHERE (b.flight1 = :flightId OR b.flight2 = :flightId) " +
           "AND b.dateOfFlight >= :startDate AND b.dateOfFlight <= :endDate " +
           "AND b.status = 'CONFIRMED'")
    List<Booking> findByFlightAndDateRange(
            @Param("flightId") Integer flightId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    /**
     * Find CONFIRMED bookings within a date range for revenue calculation.
     */
    @Query("SELECT b FROM Booking b WHERE b.dateOfFlight >= :startDate AND b.dateOfFlight <= :endDate AND b.status = 'CONFIRMED'")
    List<Booking> findConfirmedBookingsByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}
package com.team26.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.team26.backend.model.Passenger;

@Repository
public interface PassengerRepository extends JpaRepository<Passenger, Integer> {

    List<Passenger> findByBookingId(Integer bookingId);

    @Query("""
        SELECT p.seat1, p.seat2, b.flight1, b.flight2
        FROM Passenger p, Booking b
        WHERE p.bookingId = b.bookId
        AND (b.flight1 = :flightId OR b.flight2 = :flightId)
        AND b.dateOfFlight = :date
    """)
    List<Object[]> findSeatsByFlightAndDate(
        @Param("flightId") Integer flightId,
        @Param("date") java.time.LocalDate date
    );

    @Query("SELECT p, b FROM Passenger p JOIN Booking b ON p.bookingId = b.bookId " +
           "WHERE (b.flight1 = :flightId OR b.flight2 = :flightId) " +
           "AND b.dateOfFlight >= :startDate AND b.dateOfFlight <= :endDate " +
           "AND b.status = 'CONFIRMED' " +
           "ORDER BY b.dateOfFlight, " +
           "CASE WHEN UPPER(b.seatClass) = 'FIRST' THEN 1 " +
           "WHEN UPPER(b.seatClass) = 'BUSINESS' THEN 2 ELSE 3 END")
    List<Object[]> findPassengersByFlightAndDateRange(
            @Param("flightId") Integer flightId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}

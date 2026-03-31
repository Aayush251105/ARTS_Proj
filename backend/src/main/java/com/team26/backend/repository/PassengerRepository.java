package com.team26.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.team26.backend.model.Passengers;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface PassengerRepository extends JpaRepository<Passengers, Integer> {

  @Query("""
    SELECT p.seat1, p.seat2, b.flight1, b.flight2
    FROM Passengers p, Booking b
    WHERE p.bookingId = b.bookId
    AND (b.flight1 = :flightId OR b.flight2 = :flightId)
    AND b.dateOfFlight = :date
""")
List<Object[]> findSeatsByFlightAndDate(
    @Param("flightId") Integer flightId,
    @Param("date") java.time.LocalDate date
);

}

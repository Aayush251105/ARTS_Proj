package com.team26.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.team26.backend.model.Cancellation;

@Repository
public interface CancellationRepository extends JpaRepository<Cancellation, Integer> {

    @Query("SELECT c, b FROM Cancellation c JOIN Booking b ON c.bookId = b.bookId " +
           "WHERE b.status = 'CANCELLED' " +
           "AND b.dateOfFlight >= :startDate AND b.dateOfFlight <= :endDate")
    List<Object[]> findCancellationsWithBookingsByDateRange(
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);
}

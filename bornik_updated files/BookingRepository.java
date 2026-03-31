package com.team26.backend.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.team26.backend.model.Booking;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {

    // Explicitly use the field name 'userId' from the Model
    List<Booking> findByUserId(Integer userId);

    // Fixed query: Using 'Cancellations' table logic to find IDs
    @Query(value = "SELECT bookid FROM Cancellations WHERE bookid IN " +
           "(SELECT bookid FROM Booking WHERE userid = :userId)", nativeQuery = true)
    List<Integer> findCancelledBookingIdsByUserId(@Param("userId") Integer userId);

    // Optimized logic: Instead of creating new objects, we update the status of fetched ones
    default List<Booking> findByUserIdWithStatus(Integer userId) {
        List<Booking> results = findByUserId(userId);
        List<Integer> cancelledIds = findCancelledBookingIdsByUserId(userId);

        for (Booking b : results) {
            if (cancelledIds.contains(b.getBookId())) {
                b.setStatus("CANCELLED");
            } else {
                b.setStatus("CONFIRMED");
            }
        }
        return results;
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
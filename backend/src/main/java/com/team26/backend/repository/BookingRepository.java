package com.team26.backend.repository;

import java.util.List; // Make sure this matches your model name

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.team26.backend.model.Booking;

@Repository
// Change the second type from Long to match the new ID if necessary, 
// but JpaRepository<Booking, Long> is usually fine as long as bookId is Long.
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserId(Long userId);
}
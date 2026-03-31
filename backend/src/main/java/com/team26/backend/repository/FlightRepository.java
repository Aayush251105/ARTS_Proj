package com.team26.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.team26.backend.model.Flight;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FlightRepository extends JpaRepository<Flight, Integer> {

    List<Flight> findByFromLocationIgnoreCaseAndToLocationIgnoreCase(String from, String to);

    List<Flight> findByFromLocation(String from);

}

package com.team26.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.team26.backend.model.Flights;
import java.util.List;

public interface FlightRepository extends JpaRepository<Flights, Integer> {

    List<Flights> findByFromLocationIgnoreCaseAndToLocationIgnoreCase(String from, String to);

    List<Flights> findByFromLocation(String from);

}
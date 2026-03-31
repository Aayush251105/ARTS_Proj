package com.team26.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.team26.backend.model.Flight;
import com.team26.backend.repository.FlightRepository;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "http://localhost:5173")
public class FlightController {

    @Autowired
    private FlightRepository flightRepository;

    // GET all flights
    @GetMapping
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    // GET flight by ID
    @GetMapping("/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable Integer id) {
        return flightRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create new flight
    @PostMapping
    public Flight createFlight(@RequestBody Flight flight) {
        return flightRepository.save(flight);
    }

    // PUT update flight
    @PutMapping("/{id}")
    public ResponseEntity<Flight> updateFlight(@PathVariable Integer id, @RequestBody Flight updated) {
        return flightRepository.findById(id).map(flight -> {
            flight.setFromLocation(updated.getFromLocation());
            flight.setToLocation(updated.getToLocation());
            flight.setNumSeats(updated.getNumSeats());
            flight.setPFirst(updated.getPFirst());
            flight.setPBusiness(updated.getPBusiness());
            flight.setPEcon(updated.getPEcon());
            flight.setTakeoffT(updated.getTakeoffT());
            flight.setLandingT(updated.getLandingT());
            flight.setCrewId(updated.getCrewId());
            return ResponseEntity.ok(flightRepository.save(flight));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE flight
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Integer id) {
        if (flightRepository.existsById(id)) {
            flightRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}

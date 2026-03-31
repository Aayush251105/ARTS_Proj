package com.team26.backend.controller;

import com.team26.backend.repository.PassengerRepository;
import com.team26.backend.repository.CityRepository;
import com.team26.backend.service.FlightService;
import com.team26.backend.model.City;
import com.team26.backend.model.Flight;
import com.team26.backend.repository.FlightRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "http://localhost:5173")
public class FlightController {

    private final FlightService flightService;

    @Autowired
    private PassengerRepository passengerRepository;
    
    @Autowired
    private CityRepository cityRepository;

    @Autowired
    private FlightRepository flightRepository;

    public FlightController(FlightService flightService) {
        this.flightService = flightService;
    }

    // GET all flights (from main)
    @GetMapping
    public List<Flight> getAllFlights() {
        return flightRepository.findAll();
    }

    // GET flight by ID (from main)
    @GetMapping("/{id}")
    public ResponseEntity<Flight> getFlightById(@PathVariable Integer id) {
        return flightRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create new flight (from main)
    @PostMapping
    public Flight createFlight(@RequestBody Flight flight) {
        return flightRepository.save(flight);
    }

    // PUT update flight (from main)
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

    // DELETE flight (from main)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFlight(@PathVariable Integer id) {
        if (flightRepository.existsById(id)) {
            flightRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // ✅ CHECK IF CITY IS INTERNATIONAL
    @GetMapping("/city/is-international/{cityName}")
    public Map<String, Object> checkCityInternational(@PathVariable String cityName) {
        Optional<City> city = cityRepository.findByNameIgnoreCase(cityName);
        return Map.of(
            "city", cityName,
            "isInternational", city.map(City::getIsInternational).orElse(false)
        );
    }

    // ---------------- SEARCH FLIGHTS ----------------
    @GetMapping("/search")
    public List<Map<String, Object>> searchFlights(
        @RequestParam String from,
        @RequestParam String to,
        @RequestParam String date,
        @RequestParam(defaultValue = "ECONOMY") String travelClass) {

        return flightService.searchFlights(from, to, date, travelClass);
    }

    // ---------------- GET BOOKED SEATS ----------------
    @GetMapping("/seats/{flightId}")
    public List<Integer> getBookedSeats(
            @PathVariable Integer flightId,
            @RequestParam String date
    ) {
        try {
            LocalDate parsedDate = LocalDate.parse(date);

            List<Object[]> rows =
                    passengerRepository.findSeatsByFlightAndDate(
                            flightId,
                            parsedDate
                    );

            Set<Integer> seats = new HashSet<>();

            for (Object[] row : rows) {
                // row[0] = seat1, row[1] = seat2, row[2] = flight1, row[3] = flight2
                Integer f1 = row[2] != null ? Integer.parseInt(row[2].toString()) : null;
                Integer f2 = row[3] != null ? Integer.parseInt(row[3].toString()) : null;

                if (f1 != null && f1.equals(flightId) && row[0] != null) {
                    seats.add(extractSeat(row[0].toString()));
                }

                if (f2 != null && f2.equals(flightId) && row[1] != null) {
                    seats.add(extractSeat(row[1].toString()));
                }
            }

            return new ArrayList<>(seats);

        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // helper
    private int extractSeat(String seat) {
        return Integer.parseInt(seat.replaceAll("[^0-9]", ""));
    }
}

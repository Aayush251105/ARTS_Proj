package com.team26.backend.service;

import com.team26.backend.model.Flight;
import com.team26.backend.repository.FlightRepository;
import com.team26.backend.repository.PassengerRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FlightService {

    private final FlightRepository flightRepository;
    private final PassengerRepository passengerRepository;

    public FlightService(FlightRepository flightRepository,
                         PassengerRepository passengerRepository) {
        this.flightRepository = flightRepository;
        this.passengerRepository = passengerRepository;
    }

    private int extractSeatNumber(Integer seat) {
        // Seats are now stored as integers, no extraction needed
        return seat != null ? seat : 0;
    }

    public List<Map<String, Object>> searchFlights(String from, String to , String date, String travelClass) {

        List<Map<String, Object>> result = new ArrayList<>();
        String classKey = travelClass.toLowerCase();

        // ---------------- DIRECT ----------------
        List<Flight> directFlights =
                flightRepository.findByFromLocationIgnoreCaseAndToLocationIgnoreCase(from, to);

        for (Flight f : directFlights) {
            Map<String, Object> map = new HashMap<>();
            map.put("type", "DIRECT");
            map.put("flight1", f);
           map.put("seats", getAvailableSeats(
                f.getFlightId(),
                date
            ));
            result.add(map);
        }

        // ---------------- CONNECTING ----------------
        List<Flight> firstLegs = flightRepository.findByFromLocation(from);

        for (Flight f1 : firstLegs) {

            List<Flight> secondLegs =
                    flightRepository.findByFromLocationIgnoreCaseAndToLocationIgnoreCase(
                            f1.getToLocation(), to);

            for (Flight f2 : secondLegs) {

                // ⏱️ 2 hour rule with LocalTime support
                if (isValidConnectingFlight(f1.getLandingT(), f2.getTakeoffT())) {

                    Map<String, Object> map = new HashMap<>();
                    map.put("type", "CONNECTING");
                    map.put("flight1", f1);
                    map.put("flight2", f2);

                    Map<String, Integer> s1 = getAvailableSeats(
                        f1.getFlightId(),
                        date
                    );

                    Map<String, Integer> s2 = getAvailableSeats(
                        f2.getFlightId(),
                        date
                    );    

                    // bottleneck
                    Map<String, Integer> finalSeats = new HashMap<>();
                    finalSeats.put("first", Math.min(s1.get("first"), s2.get("first")));
                    finalSeats.put("business", Math.min(s1.get("business"), s2.get("business")));
                    finalSeats.put("economy", Math.min(s1.get("economy"), s2.get("economy")));

                    map.put("seats", finalSeats);

                    result.add(map);
                }
            }
        }

        // Filter results to only include flights with available seats in requested class
        result.removeIf(flight -> {
            Map<String, Integer> seats = (Map<String, Integer>) flight.get("seats");
            return seats.get(classKey) == null || seats.get(classKey) == 0;
        });

        return result;
    }

    // Validate connecting flight with 2-hour layover rule for LocalTime
    private boolean isValidConnectingFlight(java.time.LocalTime landingTime, java.time.LocalTime takeoffTime) {
        // Add 2 hours to landing time for minimum connection time
        java.time.LocalTime minDepartureTime = landingTime.plusHours(2);
        
        // Case 1: Both times are on same day pattern (no overnight consideration)
        // Use !isBefore which means >= (greater than or equal to)
        if (!takeoffTime.isBefore(minDepartureTime)) {
            return true;
        }
        
        // Case 2: Landing is late, takeoff is early morning (overnight scenario)
        // If landing > 20:00 and takeoff < 05:00, it's likely overnight
        if (landingTime.isAfter(java.time.LocalTime.of(20, 0)) && takeoffTime.isBefore(java.time.LocalTime.of(5, 0))) {
            // Check if takeoff time (next day) + 24 hours > landing time + 2 hours
            java.time.LocalTime adjustedTakeoff = takeoffTime.plusHours(24);
            return !adjustedTakeoff.isBefore(minDepartureTime);
        }
        
        return false;
    }

    // ---------------- SEAT LOGIC ----------------
    private Map<String, Integer> getAvailableSeats(
        Integer flightId,
        String date
    ) {

    Flight flight = flightRepository.findById(flightId).orElseThrow();
    int totalSeats = flight.getNumSeats();

    int firstLimit = (int) Math.ceil(totalSeats * 0.2);
    int businessLimit = (int) Math.ceil(totalSeats * 0.4);

    List<Object[]> rows =
        passengerRepository.findSeatsByFlightAndDate(
            flightId,
            java.time.LocalDate.parse(date)
        );

    Set<Integer> bookedSeats = new HashSet<>();

    for (Object[] row : rows) {

        if (row[0] != null) {
            int seatNum = ((Number) row[0]).intValue();
            bookedSeats.add(seatNum);
        }

        if (row[1] != null) {
            int seatNum = ((Number) row[1]).intValue();
            bookedSeats.add(seatNum);
        }
    }

    int first = 0, business = 0, economy = 0;

    for (int i = 1; i <= totalSeats; i++) {

        if (!bookedSeats.contains(i)) {

            if (i <= firstLimit) first++;
            else if (i <= businessLimit) business++;
            else economy++;
        }
    }

    Map<String, Integer> map = new HashMap<>();
    map.put("first", first);
    map.put("business", business);
    map.put("economy", economy);

    return map;
}
}
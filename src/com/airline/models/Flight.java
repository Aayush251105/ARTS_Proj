package com.airline.models;
import java.time.LocalDateTime;
import java.util.List;

public class Flight {
    private int flightId;
    private String flightNumber;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private double fare;
    
    public Flight(int flightId, String flightNumber, LocalDateTime departureTime, LocalDateTime arrivalTime,
            double fare, Route route, Aircraft aircraft, List<Seat> seats, List<Crew> crewMembers) {
        this.flightId = flightId;
        this.flightNumber = flightNumber;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.fare = fare;
        this.route = route;
        this.aircraft = aircraft;
        this.seats = seats;
        this.crewMembers = crewMembers;
    }
    private Route route;
    private Aircraft aircraft;
    private List<Seat> seats;
    private List<Crew> crewMembers;

    public void updateFlightSchedule() {}
    public void assignCrew(Crew crew) {}
    public int getFlightId() {
        return flightId;
    }
    public void setFlightId(int flightId) {
        this.flightId = flightId;
    }
    public String getFlightNumber() {
        return flightNumber;
    }
    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }
    public LocalDateTime getDepartureTime() {
        return departureTime;
    }
    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }
    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }
    public void setArrivalTime(LocalDateTime arrivalTime) {
        this.arrivalTime = arrivalTime;
    }
    public double getFare() {
        return fare;
    }
    public void setFare(double fare) {
        this.fare = fare;
    }
    public Route getRoute() {
        return route;
    }
    public void setRoute(Route route) {
        this.route = route;
    }
    public Aircraft getAircraft() {
        return aircraft;
    }
    public void setAircraft(Aircraft aircraft) {
        this.aircraft = aircraft;
    }
    public List<Seat> getSeats() {
        return seats;
    }
    public void setSeats(List<Seat> seats) {
        this.seats = seats;
    }
    public List<Crew> getCrewMembers() {
        return crewMembers;
    }
    public void setCrewMembers(List<Crew> crewMembers) {
        this.crewMembers = crewMembers;
    }
}
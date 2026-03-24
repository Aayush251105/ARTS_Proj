package com.airline.models;
import java.util.List;

public class Passenger extends User {
    // Corrected Constructor
    public Passenger(int userId, String name, String email, String password, String role) {
        super(userId, name, email, password, role); // Calls the User constructor
    }

    public List<Flight> searchFlights(String source, String destination, String date) { return null; }
    public void bookTicket() {}
    public void viewBookings() {}
    public void cancelBooking(int bookingId) {}
}
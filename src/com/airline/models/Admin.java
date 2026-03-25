package com.airline.models;

public class Admin extends User {
    
    // Updated Constructor
    public Admin(int userId, String name, String email, String password, String role) {
        // Pass the data up to the User class
        super(userId, name, email, password, role);
    }

    public void manageFlights() {
    }

    public void manageRoutes() {
    }
}
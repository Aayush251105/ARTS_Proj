package com.team26.backend.dto;

public class PassengerDTO {
    private String name;
    private String passport;
    private String seatFlight1;
    private String seatFlight2;

    // ✅ Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPassport() { return passport; }
    public void setPassport(String passport) { this.passport = passport; }

    public String getSeatFlight1() { return seatFlight1; }
    public void setSeatFlight1(String seatFlight1) { this.seatFlight1 = seatFlight1; }

    public String getSeatFlight2() { return seatFlight2; }
    public void setSeatFlight2(String seatFlight2) { this.seatFlight2 = seatFlight2; }
}

package com.airline.models;

public class PassengerDetails {
    private int passengerId;
    private String passportId;

    public boolean verifyPassportID(String passportId) { return true; }

    public PassengerDetails(int passengerId, String passportId) {
        this.passengerId = passengerId;
        this.passportId = passportId;
    }

    public int getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(int passengerId) {
        this.passengerId = passengerId;
    }

    public String getPassportId() {
        return passportId;
    }

    public void setPassportId(String passportId) {
        this.passportId = passportId;
    }
}
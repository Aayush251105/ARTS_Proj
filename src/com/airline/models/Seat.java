package com.airline.models;

public class Seat {
    private String seatNumber;
    private String seatClass;
    private String status;
    public String getSeatNumber() {
        return seatNumber;
    }
    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }
    public Seat(String seatNumber, String seatClass, String status) {
        this.seatNumber = seatNumber;
        this.seatClass = seatClass;
        this.status = status;
    }
    public String getSeatClass() {
        return seatClass;
    }
    public void setSeatClass(String seatClass) {
        this.seatClass = seatClass;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}
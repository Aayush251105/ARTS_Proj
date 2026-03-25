package com.airline.models;

public class Ticket {
    private String ticketId; 
    private String seatNumber;
    public String getTicketId() {
        return ticketId;
    }
    public void setTicketId(String ticketId) {
        this.ticketId = ticketId;
    }
    public Ticket(String ticketId, String seatNumber) {
        this.ticketId = ticketId;
        this.seatNumber = seatNumber;
    }
    public String getSeatNumber() {
        return seatNumber;
    }
    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }
}
package com.airline.models;
import java.util.Date;
import java.util.List;

public class Booking {
    private int bookingId;
    private Date bookingDate;
    private String status;
    private String seatClass;
    
    private Flight flight;
    private List<Ticket> tickets;
    private List<PassengerDetails> passengers;
    private Payment payment;
    private Refund refund;

    public Booking(Date bookingDate, int bookingId, Flight flight, List<PassengerDetails> passengers, Payment payment, Refund refund, String seatClass, String status, List<Ticket> tickets) {
        this.bookingDate = bookingDate;
        this.bookingId = bookingId;
        this.flight = flight;
        this.passengers = passengers;
        this.payment = payment;
        this.refund = refund;
        this.seatClass = seatClass;
        this.status = status;
        this.tickets = tickets;
    }
    public int getBookingId() {
        return bookingId;
    }
    public void setBookingId(int bookingId) {
        this.bookingId = bookingId;
    }
    public Date getBookingDate() {
        return bookingDate;
    }
    public void setBookingDate(Date bookingDate) {
        this.bookingDate = bookingDate;
    }
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
    public String getSeatClass() {
        return seatClass;
    }
    public void setSeatClass(String seatClass) {
        this.seatClass = seatClass;
    }
    public Flight getFlight() {
        return flight;
    }
    public void setFlight(Flight flight) {
        this.flight = flight;
    }
    public List<Ticket> getTickets() {
        return tickets;
    }
    public void setTickets(List<Ticket> tickets) {
        this.tickets = tickets;
    }
    public List<PassengerDetails> getPassengers() {
        return passengers;
    }
    public void setPassengers(List<PassengerDetails> passengers) {
        this.passengers = passengers;
    }
    public Payment getPayment() {
        return payment;
    }
    public void setPayment(Payment payment) {
        this.payment = payment;
    }
    public Refund getRefund() {
        return refund;
    }
    public void setRefund(Refund refund) {
        this.refund = refund;
    }
}
package com.team26.backend.model;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Booking")
public class Booking {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookID")
    private Integer bookId;

    @Column(name = "UserID")
    private Integer userId;

    @Column(name = "SeatClass")
    private String seatClass;

    @Column(name = "BookingPrice")
    private BigDecimal bookingPrice;

    @Column(name = "FromLocation")
    private String fromLocation;

    @Column(name = "ToLocation")
    private String toLocation;

    @Column(name = "DateOfFlight")
    private LocalDate dateOfFlight;

    @Column(name = "NumSeatsBook")
    private Integer numSeatsBook;

    // --- MANUAL GETTERS (Crucial for JSON) ---
    public Integer getBookId() { return bookId; }
    public void setBookId(Integer bookId) { this.bookId = bookId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public String getSeatClass() { return seatClass; }
    public void setSeatClass(String seatClass) { this.seatClass = seatClass; }

    public BigDecimal getBookingPrice() { return bookingPrice; }
    public void setBookingPrice(BigDecimal bookingPrice) { this.bookingPrice = bookingPrice; }

    public String getFromLocation() { return fromLocation; }
    public void setFromLocation(String fromLocation) { this.fromLocation = fromLocation; }

    public String getToLocation() { return toLocation; }
    public void setToLocation(String toLocation) { this.toLocation = toLocation; }

    public LocalDate getDateOfFlight() { return dateOfFlight; }
    public void setDateOfFlight(LocalDate dateOfFlight) { this.dateOfFlight = dateOfFlight; }

    public Integer getNumSeatsBook() { return numSeatsBook; }
    public void setNumSeatsBook(Integer numSeatsBook) { this.numSeatsBook = numSeatsBook; }
}
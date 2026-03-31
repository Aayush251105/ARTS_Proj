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

    @Column(name = "Flight1")
    private Integer flight1;

    @Column(name = "Flight2")
    private Integer flight2;

    @Column(name = "SeatClass")
    private String seatClass;

    @Column(name = "BookingPrice")
    private BigDecimal bookingPrice;

    @Column(name = "FromLocation")
    private String fromLocation;

    @Column(name = "Via")
    private String via;

    @Column(name = "ToLocation")
    private String toLocation;

    @Column(name = "DateOfFlight")
    private LocalDate dateOfFlight;

    @Column(name = "NumSeatsBook")
    private Integer numSeatsBook;

    @Column(name = "Status")
    private String status;

    // --- MANUAL GETTERS & SETTERS (Crucial for JSON) ---
    public Integer getBookId() { return bookId; }
    public void setBookId(Integer bookId) { this.bookId = bookId; }

    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getFlight1() { return flight1; }
    public void setFlight1(Integer flight1) { this.flight1 = flight1; }

    public Integer getFlight2() { return flight2; }
    public void setFlight2(Integer flight2) { this.flight2 = flight2; }

    public String getSeatClass() { return seatClass; }
    public void setSeatClass(String seatClass) { this.seatClass = seatClass; }

    public BigDecimal getBookingPrice() { return bookingPrice; }
    public void setBookingPrice(BigDecimal bookingPrice) { this.bookingPrice = bookingPrice; }

    public String getFromLocation() { return fromLocation; }
    public void setFromLocation(String fromLocation) { this.fromLocation = fromLocation; }

    public String getVia() { return via; }
    public void setVia(String via) { this.via = via; }

    public String getToLocation() { return toLocation; }
    public void setToLocation(String toLocation) { this.toLocation = toLocation; }

    public LocalDate getDateOfFlight() { return dateOfFlight; }
    public void setDateOfFlight(LocalDate dateOfFlight) { this.dateOfFlight = dateOfFlight; }

    public Integer getNumSeatsBook() { return numSeatsBook; }
    public void setNumSeatsBook(Integer numSeatsBook) { this.numSeatsBook = numSeatsBook; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
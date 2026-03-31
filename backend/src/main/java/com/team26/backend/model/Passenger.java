package com.team26.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Passengers")
public class Passenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PNR")
    private Integer pnr;

    @Column(name = "BookingID")
    private Integer bookingId;

    @Column(name = "PassName")
    private String passName;

    @Column(name = "Seat1")
    private String seat1;

    @Column(name = "Seat2")
    private String seat2;

    @Column(name = "Passport")
    private String passport;

    // --- Getters and Setters ---
    public Integer getPnr() { return pnr; }
    public void setPnr(Integer pnr) { this.pnr = pnr; }

    public Integer getBookingId() { return bookingId; }
    public void setBookingId(Integer bookingId) { this.bookingId = bookingId; }

    public String getPassName() { return passName; }
    public void setPassName(String passName) { this.passName = passName; }

    public String getSeat1() { return seat1; }
    public void setSeat1(String seat1) { this.seat1 = seat1; }

    public String getSeat2() { return seat2; }
    public void setSeat2(String seat2) { this.seat2 = seat2; }

    public String getPassport() { return passport; }
    public void setPassport(String passport) { this.passport = passport; }
}

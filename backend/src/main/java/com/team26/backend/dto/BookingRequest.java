package com.team26.backend.dto;

import java.util.List;

public class BookingRequest {
    private Integer userId;
    private Integer flight1;
    private Integer flight2;
    private String seatClass;
    private Double bookingPrice;
    private String fromLocation;
    private String toLocation;
    private Integer numSeatsBook;
    private String dateOfFlight;
    private Boolean isInternational;
    private List<PassengerDTO> passengers;

    // ✅ Getters and Setters
    public Integer getUserId() { return userId; }
    public void setUserId(Integer userId) { this.userId = userId; }

    public Integer getFlight1() { return flight1; }
    public void setFlight1(Integer flight1) { this.flight1 = flight1; }

    public Integer getFlight2() { return flight2; }
    public void setFlight2(Integer flight2) { this.flight2 = flight2; }

    public String getSeatClass() { return seatClass; }
    public void setSeatClass(String seatClass) { this.seatClass = seatClass; }

    public Double getBookingPrice() { return bookingPrice; }
    public void setBookingPrice(Double bookingPrice) { this.bookingPrice = bookingPrice; }

    public String getFromLocation() { return fromLocation; }
    public void setFromLocation(String fromLocation) { this.fromLocation = fromLocation; }

    public String getToLocation() { return toLocation; }
    public void setToLocation(String toLocation) { this.toLocation = toLocation; }

    public Integer getNumSeatsBook() { return numSeatsBook; }
    public void setNumSeatsBook(Integer numSeatsBook) { this.numSeatsBook = numSeatsBook; }

    public String getDateOfFlight() { return dateOfFlight; }
    public void setDateOfFlight(String dateOfFlight) { this.dateOfFlight = dateOfFlight; }

    public Boolean getIsInternational() { return isInternational; }
    public void setIsInternational(Boolean isInternational) { this.isInternational = isInternational; }

    public List<PassengerDTO> getPassengers() { return passengers; }
    public void setPassengers(List<PassengerDTO> passengers) { this.passengers = passengers; }
}

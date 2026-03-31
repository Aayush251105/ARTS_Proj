package com.team26.backend.dto;

public class BookingResponse {
    private Integer bookId;
    private String message;
    private Integer passengersCount;

    public BookingResponse(Integer bookId, String message, Integer passengersCount) {
        this.bookId = bookId;
        this.message = message;
        this.passengersCount = passengersCount;
    }

    // ✅ Getters and Setters
    public Integer getBookId() { return bookId; }
    public void setBookId(Integer bookId) { this.bookId = bookId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Integer getPassengersCount() { return passengersCount; }
    public void setPassengersCount(Integer passengersCount) { this.passengersCount = passengersCount; }
}

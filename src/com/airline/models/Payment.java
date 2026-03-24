package com.airline.models;

public class Payment {
    private int paymentId;
    private double amount;
    private String status;

    public void processPayment() {}

    public int getPaymentId() {
        return paymentId;
    }

    public Payment(int paymentId, double amount, String status) {
        this.paymentId = paymentId;
        this.amount = amount;
        this.status = status;
    }

    public void setPaymentId(int paymentId) {
        this.paymentId = paymentId;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
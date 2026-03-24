package com.airline.models;

public class Refund {
    private int refundId;
    private double amount;

    public double calculateRefund(int bookingId) { return 0.0; }

    public int getRefundId() {
        return refundId;
    }

    public void setRefundId(int refundId) {
        this.refundId = refundId;
    }

    public Refund(int refundId, double amount) {
        this.refundId = refundId;
        this.amount = amount;
    }

    public double getAmount() {
        return amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }
}
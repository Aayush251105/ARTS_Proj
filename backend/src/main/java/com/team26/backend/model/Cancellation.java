package com.team26.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "Cancellations")
public class Cancellation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CancellationID")
    private Integer cancellationId;

    @Column(name = "BookID")
    private Integer bookId;

    @Column(name = "CancellationDate")
    private LocalDateTime cancellationDate;

    @Column(name = "RefundAmt")
    private BigDecimal refundAmt;

    // --- Getters and Setters ---
    public Integer getCancellationId() { return cancellationId; }
    public void setCancellationId(Integer cancellationId) { this.cancellationId = cancellationId; }

    public Integer getBookId() { return bookId; }
    public void setBookId(Integer bookId) { this.bookId = bookId; }

    public LocalDateTime getCancellationDate() { return cancellationDate; }
    public void setCancellationDate(LocalDateTime cancellationDate) { this.cancellationDate = cancellationDate; }

    public BigDecimal getRefundAmt() { return refundAmt; }
    public void setRefundAmt(BigDecimal refundAmt) { this.refundAmt = refundAmt; }
}

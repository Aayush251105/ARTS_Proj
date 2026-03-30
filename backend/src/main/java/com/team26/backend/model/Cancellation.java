package com.team26.backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "cancellations")
public class Cancellation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cancellationid")
    private Integer cancellationId;

    @Column(name = "bookid")
    private Integer bookId;

    @Column(name = "cancellationdate")
    private LocalDateTime cancellationDate = LocalDateTime.now();

    @Column(name = "refundamt")
    private BigDecimal refundAmt;
}
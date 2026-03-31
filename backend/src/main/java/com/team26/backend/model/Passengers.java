package com.team26.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "Passengers")
public class Passengers {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "PNR")
    private Integer pnr;

    @Column(name = "BookingID")
    private Integer bookingId;

    @Column(name = "PassName")
    private String passName;

    @Column(name = "Seat1")
    private Integer seat1;

    @Column(name = "Seat2")
    private Integer seat2;

    @Column(name = "Passport")
    private String passport;
}
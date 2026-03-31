package com.team26.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalTime;

@Getter
@Setter
@Entity
@Table(name = "Flights")
public class Flights {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FlightID")
    private Integer flightId;

    @Column(name = "FromLocation")
    private String fromLocation;

    @Column(name = "ToLocation")
    private String toLocation;

    @Column(name = "NumSeats")
    private Integer numSeats;

    @Column(name = "PFirst")
    private BigDecimal pFirst;

    @Column(name = "PBusiness")
    private BigDecimal pBusiness;

    @Column(name = "PEcon")
    private BigDecimal pEcon;

    @Column(name = "TakeoffT")
    private LocalTime takeoffT;

    @Column(name = "LandingT")
    private LocalTime landingT;

    @Column(name = "CrewID")
    private Integer crewId;
}
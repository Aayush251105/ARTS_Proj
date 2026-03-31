package com.team26.backend.model;

import java.math.BigDecimal;
import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "flights")
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "flightid")
    private Integer flightId;

    @Column(name = "fromlocation")
    private String fromLocation;

    @Column(name = "tolocation")
    private String toLocation;

    @Column(name = "numseats")
    private Integer numSeats;

    @JsonProperty("pFirst")
    @Column(name = "pfirst")
    private BigDecimal pFirst;

    @JsonProperty("pBusiness")
    @Column(name = "pbusiness")
    private BigDecimal pBusiness;

    @JsonProperty("pEcon")
    @Column(name = "pecon")
    private BigDecimal pEcon;

    @Column(name = "takeofft")
    private LocalTime takeoffT;

    @Column(name = "landingt")
    private LocalTime landingT;

    @Column(name = "crewid")
    private Integer crewId;

    // --- Getters & Setters ---
    public Integer getFlightId() { return flightId; }
    public void setFlightId(Integer flightId) { this.flightId = flightId; }

    public String getFromLocation() { return fromLocation; }
    public void setFromLocation(String fromLocation) { this.fromLocation = fromLocation; }

    public String getToLocation() { return toLocation; }
    public void setToLocation(String toLocation) { this.toLocation = toLocation; }

    public Integer getNumSeats() { return numSeats; }
    public void setNumSeats(Integer numSeats) { this.numSeats = numSeats; }

    public BigDecimal getPFirst() { return pFirst; }
    public void setPFirst(BigDecimal pFirst) { this.pFirst = pFirst; }

    public BigDecimal getPBusiness() { return pBusiness; }
    public void setPBusiness(BigDecimal pBusiness) { this.pBusiness = pBusiness; }

    public BigDecimal getPEcon() { return pEcon; }
    public void setPEcon(BigDecimal pEcon) { this.pEcon = pEcon; }

    public LocalTime getTakeoffT() { return takeoffT; }
    public void setTakeoffT(LocalTime takeoffT) { this.takeoffT = takeoffT; }

    public LocalTime getLandingT() { return landingT; }
    public void setLandingT(LocalTime landingT) { this.landingT = landingT; }

    public Integer getCrewId() { return crewId; }
    public void setCrewId(Integer crewId) { this.crewId = crewId; }
}

package com.team26.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "crew")
public class Crew {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "crewid")
    private Integer crewId;

    @Column(name = "crewcapacity")
    private Integer crewCapacity;

    // --- Getters & Setters ---
    public Integer getCrewId() { return crewId; }
    public void setCrewId(Integer crewId) { this.crewId = crewId; }

    public Integer getCrewCapacity() { return crewCapacity; }
    public void setCrewCapacity(Integer crewCapacity) { this.crewCapacity = crewCapacity; }
}

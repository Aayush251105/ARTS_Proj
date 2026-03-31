package com.team26.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "city")
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cityid")   // map to existing column
    private Integer cityId;

    @Column(name = "name")
    private String name;

    @Column(name = "isinternational")
    private Boolean isInternational;

    public Integer getCityId() { return cityId; }
    public void setCityId(Integer cityId) { this.cityId = cityId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Boolean getIsInternational() { return isInternational; }
    public void setIsInternational(Boolean isInternational) { this.isInternational = isInternational; }
}
package com.team26.backend.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "city")
public class City {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "cityid")   // map to existing column
    private Integer cityId;

    @Column(name = "name")
    private String name;

    @Column(name = "isinternational")  // map to existing column
    private Boolean isInternational;
}
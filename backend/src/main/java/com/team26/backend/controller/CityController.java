package com.team26.backend.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.team26.backend.model.City;
import com.team26.backend.repository.CityRepository;

@RestController
@RequestMapping("/api/cities")
@CrossOrigin(origins = "http://localhost:5173")
public class CityController {

    private final CityRepository cityRepository;

    public CityController(CityRepository cityRepository) {
        this.cityRepository = cityRepository;
    }

    @GetMapping
    public List<City> getAllCities() {
        return cityRepository.findAll();
    }
}
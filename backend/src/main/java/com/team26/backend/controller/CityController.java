package com.team26.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.team26.backend.model.City;
import com.team26.backend.repository.CityRepository;

@RestController
@RequestMapping("/api/cities")
@CrossOrigin(origins = "http://localhost:5173")
public class CityController {

    @Autowired
    private CityRepository cityRepository;

    // GET all cities
    @GetMapping
    public List<City> getAllCities() {
        return cityRepository.findAll();
    }

    // GET city by ID
    @GetMapping("/{id}")
    public ResponseEntity<City> getCityById(@PathVariable Long id) {
        return cityRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create new city
    @PostMapping
    public City createCity(@RequestBody City city) {
        return cityRepository.save(city);
    }

    // PUT update city
    @PutMapping("/{id}")
    public ResponseEntity<City> updateCity(@PathVariable Long id, @RequestBody City updated) {
        return cityRepository.findById(id).map(city -> {
            city.setName(updated.getName());
            city.setIsInternational(updated.getIsInternational());
            return ResponseEntity.ok(cityRepository.save(city));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE city
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCity(@PathVariable Long id) {
        if (cityRepository.existsById(id)) {
            cityRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
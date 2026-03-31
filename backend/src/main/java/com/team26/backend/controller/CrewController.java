package com.team26.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.team26.backend.model.Crew;
import com.team26.backend.repository.CrewRepository;

@RestController
@RequestMapping("/api/crews")
@CrossOrigin(origins = "http://localhost:5173")
public class CrewController {

    @Autowired
    private CrewRepository crewRepository;

    // GET all crews
    @GetMapping
    public List<Crew> getAllCrews() {
        return crewRepository.findAll();
    }

    // GET crew by ID
    @GetMapping("/{id}")
    public ResponseEntity<Crew> getCrewById(@PathVariable Integer id) {
        return crewRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST create new crew
    @PostMapping
    public Crew createCrew(@RequestBody Crew crew) {
        return crewRepository.save(crew);
    }

    // PUT update crew
    @PutMapping("/{id}")
    public ResponseEntity<Crew> updateCrew(@PathVariable Integer id, @RequestBody Crew updated) {
        return crewRepository.findById(id).map(crew -> {
            crew.setCrewCapacity(updated.getCrewCapacity());
            return ResponseEntity.ok(crewRepository.save(crew));
        }).orElse(ResponseEntity.notFound().build());
    }

    // DELETE crew
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCrew(@PathVariable Integer id) {
        if (crewRepository.existsById(id)) {
            crewRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}

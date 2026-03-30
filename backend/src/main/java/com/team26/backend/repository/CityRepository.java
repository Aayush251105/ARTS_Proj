package com.team26.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.team26.backend.model.City;

public interface CityRepository extends JpaRepository<City, Long> {
}
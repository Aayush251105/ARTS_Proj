package com.team26.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.team26.backend.model.City;

@Repository
public interface CityRepository extends JpaRepository<City, Integer> {
}
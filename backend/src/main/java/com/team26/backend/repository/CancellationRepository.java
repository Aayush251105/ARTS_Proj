package com.team26.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.team26.backend.model.Cancellation;

@Repository
public interface CancellationRepository extends JpaRepository<Cancellation, Integer> {
}
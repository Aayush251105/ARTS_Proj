package com.team26.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.team26.backend.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByUsername(String username);
}
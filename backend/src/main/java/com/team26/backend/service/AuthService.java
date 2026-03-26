package com.team26.backend.service;

import org.springframework.stereotype.Service;
import com.team26.backend.model.User;
import com.team26.backend.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public String signup(User user) {

        // 🔴 Check duplicates
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Email already exists";
        }

        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return "Username already exists";
        }

        // 🔴 Basic validation
        if (user.getPassword().length() < 8) {
            return "Password must be at least 8 characters";
        }

        if (!user.getEmail().contains("@")) {
            return "Invalid email format";
        }

        // ✅ Save user
        userRepository.save(user);

        return "SUCCESS";
    }

    // login
    public String login(String email, String password) {

        var userOpt = userRepository.findByEmail(email);

        // ❌ user not found
        if (userOpt.isEmpty()) {
            return "User not found";
        }

        User user = userOpt.get();

        // ❌ wrong password
        if (!user.getPassword().equals(password)) {
            return "Invalid password";
        }

        // ✅ success
        return "SUCCESS:" + user.getUserId() + ":" + user.getRole();
    }
}
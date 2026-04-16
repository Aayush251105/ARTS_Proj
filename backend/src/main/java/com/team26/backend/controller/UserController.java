package com.team26.backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team26.backend.model.User;
import com.team26.backend.repository.UserRepository;
import com.team26.backend.util.EncryptionUtil;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Map<String, String> response = new HashMap<>();
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            response.put("role", user.getRole());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Integer id, @RequestBody Map<String, String> editData) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName(); // This usually gets the 'sub' or username from your JWT

        Optional<User> userOpt = userRepository.findById(id);
    
        if (userOpt.isPresent()) {
            User user = userOpt.get();

            // 2. SECURITY CHECK: Does the logged-in user match the user being updated?
            if (!user.getUsername().equals(currentUsername)) {
                return ResponseEntity.status(403).body("You are not authorized to edit this profile.");
            }

            if (editData.containsKey("username") && !editData.get("username").trim().isEmpty()) {
                user.setUsername(editData.get("username"));
            }
            if (editData.containsKey("email") && !editData.get("email").trim().isEmpty()) {
                user.setEmail(editData.get("email"));
            }
            if (editData.containsKey("password") && !editData.get("password").trim().isEmpty()) {
                try {
                    String encryptedPass = EncryptionUtil.encrypt(editData.get("password"));
                    user.setPassword(encryptedPass);
                } catch (Exception e) {
                    System.err.println("Failed to encrypt new password");
                }
            }
            
            userRepository.save(user);

            Map<String, String> response = new HashMap<>();
            response.put("username", user.getUsername());
            response.put("email", user.getEmail());
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

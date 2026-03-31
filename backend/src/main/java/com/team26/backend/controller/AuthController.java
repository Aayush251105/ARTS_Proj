package com.team26.backend.controller;

import org.springframework.web.bind.annotation.*;
import com.team26.backend.model.User;
import com.team26.backend.service.AuthService;
import com.team26.backend.util.JwtUtil;

import io.jsonwebtoken.Claims;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/signup")
    public String signup(@RequestBody User user) {
        return authService.signup(user);
    }

    /**
     * Login endpoint — returns JSON with JWT token on success.
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        String result = authService.login(user.getEmail(), user.getPassword());

        if (result.startsWith("SUCCESS")) {
            String[] parts = result.split(":");
            int userId = Integer.parseInt(parts[1]);
            String role = parts[2];
            String username = parts[3];

            // Generate JWT token
            String token = jwtUtil.generateToken(userId, role, username);

            response.put("status", "SUCCESS");
            response.put("token", token);
            response.put("userId", userId);
            response.put("role", role);
            response.put("username", username);
        } else {
            response.put("status", "ERROR");
            response.put("message", result);
        }

        return response;
    }

    /**
     * Validate a JWT token — used by frontend to verify admin access.
     * Expects Authorization header: "Bearer <token>"
     */
    @GetMapping("/validate")
    public Map<String, Object> validateToken(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> response = new HashMap<>();

        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.put("valid", false);
                response.put("message", "Missing or invalid Authorization header");
                return response;
            }

            String token = authHeader.substring(7);
            Claims claims = jwtUtil.validateToken(token);

            if (claims == null) {
                response.put("valid", false);
                response.put("message", "Invalid or expired token");
                return response;
            }

            response.put("valid", true);
            response.put("userId", claims.getSubject());
            response.put("role", claims.get("role", String.class));
            response.put("username", claims.get("username", String.class));
        } catch (Exception e) {
            response.put("valid", false);
            response.put("message", "Token validation failed");
        }

        return response;
    }
}
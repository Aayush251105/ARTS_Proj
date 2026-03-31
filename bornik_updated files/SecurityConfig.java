package com.team26.backend.config;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 1. Disable CSRF (Common for REST APIs using JWT)
            .csrf(csrf -> csrf.disable())
            
            // 2. Enable CORS using the bean defined below
            .cors(Customizer.withDefaults())
            
            // 3. Configure Request Authorization
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll() // Public endpoints
                .anyRequest().authenticated()           // Everything else is locked
            )
            
            // 4. Basic Auth or Form Login (Optional: adds a way to login if not using JWT yet)
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        
        // Match this to your Frontend URL (Vite/React usually 5173)
        config.setAllowedOrigins(Collections.singletonList("http://localhost:5173")); 
        
        config.setAllowedHeaders(Arrays.asList(
            "Origin", "Content-Type", "Accept", "Authorization", "Access-Control-Allow-Origin"
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
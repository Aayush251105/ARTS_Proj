package com.team26.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team26.backend.model.Cancellation;
import com.team26.backend.service.CancellationService;

@RestController
@RequestMapping("/api/cancellations")
@CrossOrigin(origins = "http://localhost:5173")
public class CancellationController {

    @Autowired
    private CancellationService cancellationService;

    @PostMapping("/{bookId}")
    public Cancellation processCancellation(@PathVariable Integer bookId) {
        return cancellationService.cancelBooking(bookId);
    }
}
package com.example.HotelReservationPlatform.controllers;

import com.example.HotelReservationPlatform.entities.Feedback;
import com.example.HotelReservationPlatform.entities.Hotel;
import com.example.HotelReservationPlatform.model.FeedbackDTO;
import com.example.HotelReservationPlatform.repos.FeedbackRepository;
import com.example.HotelReservationPlatform.repos.HotelRepository;
import com.example.HotelReservationPlatform.services.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @PostMapping
    public ResponseEntity<Feedback> createFeedback(@RequestBody FeedbackDTO feedbackDTO) {
        Feedback feedback = feedbackService.createFeedback(feedbackDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(feedback);
    }

    @GetMapping("/hotel/{hotelId}")
    public ResponseEntity<List<Feedback>> getFeedbacksByHotelId(@PathVariable Long hotelId) {
        List<Feedback> feedbacks = feedbackService.getFeedbacksByHotelId(hotelId);
        return ResponseEntity.ok(feedbacks);
    }
}
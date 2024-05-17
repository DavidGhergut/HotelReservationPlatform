package com.example.HotelReservationPlatform.services;

import com.example.HotelReservationPlatform.entities.Feedback;
import com.example.HotelReservationPlatform.entities.Hotel;
import com.example.HotelReservationPlatform.model.FeedbackDTO;
import com.example.HotelReservationPlatform.repos.FeedbackRepository;
import com.example.HotelReservationPlatform.repos.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FeedbackService {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private HotelRepository hotelRepository;

    public Feedback createFeedback(FeedbackDTO feedbackDTO) {
        Hotel hotel = hotelRepository.findById(feedbackDTO.getHotelId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid hotel ID"));

        Feedback feedback = new Feedback();
        feedback.setHotel(hotel);
        feedback.setRating(feedbackDTO.getRating());
        feedback.setComment(feedbackDTO.getComment());

        return feedbackRepository.save(feedback);
    }

    public List<Feedback> getFeedbacksByHotelId(Long hotelId) {
        return feedbackRepository.findByHotel_HotelId(hotelId);
    }
}

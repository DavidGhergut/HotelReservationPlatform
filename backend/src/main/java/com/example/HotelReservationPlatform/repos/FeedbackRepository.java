package com.example.HotelReservationPlatform.repos;

import com.example.HotelReservationPlatform.entities.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByHotel_HotelId(Long hotelId);
}

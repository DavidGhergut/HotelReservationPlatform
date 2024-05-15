package com.example.HotelReservationPlatform.repos;

import com.example.HotelReservationPlatform.entities.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FeedbackRepository extends JpaRepository<Feedback, Integer> {

}

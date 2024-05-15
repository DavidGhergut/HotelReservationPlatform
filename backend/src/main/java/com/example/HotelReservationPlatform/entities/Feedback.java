package com.example.HotelReservationPlatform.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Feedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackId;
    private int rating;
    private String comment;
    private int serviceRating;
    private int cleanlinessRating;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;
}

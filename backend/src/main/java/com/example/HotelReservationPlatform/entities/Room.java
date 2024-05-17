package com.example.HotelReservationPlatform.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roomId;

    private Long roomNumber;

    /**
     * 1 - single
     * 2 - double
     * 3 - suite or matrimonial
     */
    private Integer type;

    private Long price;

    private boolean isAvailable;

    @ManyToOne
    @JoinColumn(name = "hotel_id", nullable = false)
    @JsonBackReference
    private Hotel hotel;

    @ManyToMany(mappedBy = "rooms")
    private List<Reservation> reservations;
}


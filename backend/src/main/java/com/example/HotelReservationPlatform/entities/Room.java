package com.example.HotelReservationPlatform.entities;

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
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Integer roomId;

    private Integer roomNumber;

    /**
     * 1 - single
     * 2 - double
     * 3 - suite or matrimonial
     */
    private Integer type;

    private Integer price;

    private boolean isAvailable;

    @ManyToOne
    @JoinColumn(name = "hotel_Id")
    private Hotel hotel;

    @OneToMany(mappedBy = "room")
    private List<Reservation> reservations;
}


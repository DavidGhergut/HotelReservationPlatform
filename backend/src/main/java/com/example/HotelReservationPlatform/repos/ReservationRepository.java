package com.example.HotelReservationPlatform.repos;

import com.example.HotelReservationPlatform.entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReservationRepository extends JpaRepository<Reservation, Integer> {

}

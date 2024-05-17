package com.example.HotelReservationPlatform.repos;

import com.example.HotelReservationPlatform.entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByHotel_HotelId(Long aLong);
}

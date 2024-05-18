package com.example.HotelReservationPlatform.repos;

import com.example.HotelReservationPlatform.entities.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByHotel_HotelId(Long aLong);

    @Query("SELECT r FROM Reservation r WHERE r.hotel.hotelId = :hotelId AND r.checkInDate < :checkOutDate AND r.checkOutDate > :checkInDate")
    List<Reservation> findOverlappingReservations(@Param("hotelId") Long hotelId, @Param("checkInDate") LocalDate checkInDate, @Param("checkOutDate") LocalDate checkOutDate);
}

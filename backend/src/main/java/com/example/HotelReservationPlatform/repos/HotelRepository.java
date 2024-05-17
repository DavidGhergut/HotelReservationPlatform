package com.example.HotelReservationPlatform.repos;
import com.example.HotelReservationPlatform.entities.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long>{

    List<Hotel> findAll();
    Optional<Hotel> findById(Long hotelId);
    List<Hotel> findByLatitudeBetweenAndLongitudeBetween(double latStart, double latEnd, double lonStart, double lonEnd);
}

package com.example.HotelReservationPlatform.repos;
import com.example.HotelReservationPlatform.entities.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotelRepository extends JpaRepository<Hotel, Integer>{

}

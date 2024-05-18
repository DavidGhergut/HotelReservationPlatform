package com.example.HotelReservationPlatform.repos;
import com.example.HotelReservationPlatform.entities.Hotel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long>{

    List<Hotel> findAll();
    Optional<Hotel> findById(Long hotelId);
    List<Hotel> findByLatitudeBetweenAndLongitudeBetween(double latStart, double latEnd, double lonStart, double lonEnd);


    @Query("SELECT DISTINCT h FROM Hotel h JOIN h.rooms r WHERE r.roomId NOT IN " +
            "(SELECT rr.roomId FROM Reservation res JOIN res.rooms rr WHERE res.checkInDate < :checkOutDate AND res.checkOutDate > :checkInDate)")
    List<Hotel> findAvailableHotels(@Param("checkInDate") LocalDate checkInDate,
                                    @Param("checkOutDate") LocalDate checkOutDate);


}

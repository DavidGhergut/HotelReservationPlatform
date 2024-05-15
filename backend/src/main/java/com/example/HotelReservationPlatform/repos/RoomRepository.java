package com.example.HotelReservationPlatform.repos;

import com.example.HotelReservationPlatform.entities.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository <Room, Integer> {

}

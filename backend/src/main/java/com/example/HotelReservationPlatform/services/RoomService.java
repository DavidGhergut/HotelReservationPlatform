package com.example.HotelReservationPlatform.services;

import com.example.HotelReservationPlatform.entities.Room;
import com.example.HotelReservationPlatform.repos.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    public List<Room> getRoomsByHotelId(Long hotelId) {
        return roomRepository.findByHotel_HotelId(hotelId);
    }

    public Room getRoomById(Long roomId) {
        return roomRepository.findById(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID"));
    }

    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }

    public Room updateRoom(Long roomId, Room roomDetails) {
        return roomRepository.findById(roomId)
                .map(room -> {
                    room.setRoomNumber(roomDetails.getRoomNumber());
                    room.setType(roomDetails.getType());
                    room.setPrice(roomDetails.getPrice());
                    room.setAvailable(roomDetails.isAvailable());
                    return roomRepository.save(room);
                })
                .orElseThrow(() -> new IllegalArgumentException("Invalid room ID"));
    }

    public boolean deleteRoom(Long roomId) {
        return roomRepository.findById(roomId)
                .map(room -> {
                    roomRepository.delete(room);
                    return true;
                })
                .orElse(false);
    }
}

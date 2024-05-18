package com.example.HotelReservationPlatform.controllers;

import com.example.HotelReservationPlatform.entities.Hotel;
import com.example.HotelReservationPlatform.entities.Room;
import com.example.HotelReservationPlatform.services.HotelService;
import com.example.HotelReservationPlatform.services.ReservationService;
import com.example.HotelReservationPlatform.services.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/hotels")
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private ReservationService reservationService;

    @GetMapping
    public List<Hotel> getAllHotels() {
        return hotelService.getAllHotels();
    }

    @GetMapping("/{hotelId}")
    public Hotel getHotelById(@PathVariable Long hotelId) {
        return hotelService.getHotelById(hotelId);
    }


    @GetMapping("/{hotelId}/rooms")
    public List<Room> getRoomsByHotelId(@PathVariable Long hotelId) {
        return roomService.getRoomsByHotelId(hotelId);
    }

    @GetMapping("/{hotelId}/availability")
    public boolean checkRoomAvailability(
            @PathVariable Long hotelId,
            @RequestParam LocalDate checkInDate,
            @RequestParam LocalDate checkOutDate) {
        return reservationService.isRoomAvailable(hotelId, checkInDate, checkOutDate);
    }


}


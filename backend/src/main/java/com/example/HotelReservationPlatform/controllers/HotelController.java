package com.example.HotelReservationPlatform.controllers;

import com.example.HotelReservationPlatform.entities.Hotel;
import com.example.HotelReservationPlatform.services.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hotels")
public class HotelController {

    @Autowired
    private HotelService hotelService;

//    @GetMapping
//    public ResponseEntity<List<Hotel>> getHotels(@RequestParam(required = false) Double latitude,
//                                                 @RequestParam(required = false) Double longitude,
//                                                 @RequestParam(required = false) Double radius) {
//        List<Hotel> hotels;
//        if (latitude != null && longitude != null && radius != null) {
//            hotels = hotelService.getHotelsByRadius(latitude, longitude, radius);
//        } else {
//            hotels = hotelService.getAllHotels();
//        }
//        return ResponseEntity.ok(hotels);
//    }
//    @GetMapping("/hotels")
    @GetMapping
    public List<Hotel> getAllHotels() {
        return hotelService.getAllHotels();
    }

    @GetMapping("/{hotelId}")
    public ResponseEntity<Hotel> getHotelById(@PathVariable Long hotelId) {
        Hotel hotel = hotelService.getHotelById(hotelId);
        return ResponseEntity.ok(hotel);
    }
}


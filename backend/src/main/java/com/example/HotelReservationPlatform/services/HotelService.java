package com.example.HotelReservationPlatform.services;

import com.example.HotelReservationPlatform.entities.Hotel;
import com.example.HotelReservationPlatform.repos.HotelRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public Hotel getHotelById(Long hotelId) {
        return hotelRepository.findById(hotelId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid hotel ID"));
    }

    public List<Hotel> getHotelsByRadius(double latitude, double longitude, double radius) {
        double latStart = latitude - radius / 111; // 1 degree latitude ~ 111 km
        double latEnd = latitude + radius / 111;
        double lonStart = longitude - radius / 111;
        double lonEnd = longitude + radius / 111;
        return hotelRepository.findByLatitudeBetweenAndLongitudeBetween(latStart, latEnd, lonStart, lonEnd);
    }
}

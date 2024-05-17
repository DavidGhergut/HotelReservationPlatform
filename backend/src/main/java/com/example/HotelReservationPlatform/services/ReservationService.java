package com.example.HotelReservationPlatform.services;

import com.example.HotelReservationPlatform.entities.Hotel;
import com.example.HotelReservationPlatform.entities.Reservation;
import com.example.HotelReservationPlatform.entities.Room;
import com.example.HotelReservationPlatform.model.ReservationDTO;
import com.example.HotelReservationPlatform.model.ReservationUpdateDTO;
import com.example.HotelReservationPlatform.repos.HotelRepository;
import com.example.HotelReservationPlatform.repos.ReservationRepository;
import com.example.HotelReservationPlatform.repos.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomRepository roomRepository;

    public Reservation createReservation(ReservationDTO reservationDTO) {
        Hotel hotel = hotelRepository.findById(reservationDTO.getHotelId())
                .orElseThrow(() -> new IllegalArgumentException("Invalid hotel ID"));
        List<Room> rooms = roomRepository.findAllById(reservationDTO.getRoomIds());

        Reservation reservation = new Reservation();
        reservation.setHotel(hotel);
        reservation.setRooms(rooms);
        reservation.setCheckInDate(reservationDTO.getCheckInDate());
        reservation.setCheckOutDate(reservationDTO.getCheckOutDate());

        return reservationRepository.save(reservation);
    }

    public Optional<Reservation> updateReservation(Long reservationId, ReservationUpdateDTO reservationDTO) {
        return reservationRepository.findByHotel_HotelId(reservationId)
                .map(reservation -> {
                    if ("cancel".equals(reservationDTO.getAction())) {
                        reservationRepository.delete(reservation);
                        return null; // Indicates the reservation was deleted
                    } else if ("change".equals(reservationDTO.getAction())) {
                        List<Room> newRooms = roomRepository.findAllById(reservationDTO.getRoomIds());
                        reservation.setRooms(newRooms);
                        reservation.setCheckInDate(reservationDTO.getCheckInDate());
                        reservation.setCheckOutDate(reservationDTO.getCheckOutDate());
                        return reservationRepository.save(reservation);
                    }
                    throw new IllegalArgumentException("Invalid action");
                });
    }

    public boolean deleteReservation(Long reservationId) {
        return reservationRepository.findByHotel_HotelId(reservationId)
                .map(reservation -> {
                    reservationRepository.delete(reservation);
                    return true;
                })
                .orElse(false);
    }
}

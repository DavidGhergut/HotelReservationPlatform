package com.example.HotelReservationPlatform.services;

import com.example.HotelReservationPlatform.entities.Hotel;
import com.example.HotelReservationPlatform.entities.Reservation;
import com.example.HotelReservationPlatform.entities.Room;
import com.example.HotelReservationPlatform.model.ReservationDTO;
import com.example.HotelReservationPlatform.model.ReservationUpdateDTO;
import com.example.HotelReservationPlatform.repos.HotelRepository;
import com.example.HotelReservationPlatform.repos.ReservationRepository;
import com.example.HotelReservationPlatform.repos.RoomRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService {
    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RoomRepository roomRepository;

    public List<Reservation> getAllReservations() {
        return reservationRepository.findAll();
    }

    @Transactional
    public Reservation createReservation(Reservation reservation) {
        // Check if all rooms are available for the given dates
        for (Room room : reservation.getRooms()) {
            List<Reservation> overlappingReservations = reservationRepository.findOverlappingReservations(
                    room.getRoomId(), reservation.getCheckInDate(), reservation.getCheckOutDate());
            if (!overlappingReservations.isEmpty()) {
                throw new IllegalStateException("Room " + room.getRoomNumber() + " is not available for the selected dates.");
            }
        }

        return reservationRepository.save(reservation);
    }

    public boolean isRoomAvailable(Long hotelId, LocalDate checkInDate, LocalDate checkOutDate) {
        List<Reservation> overlappingReservations = reservationRepository.findOverlappingReservations(hotelId, checkInDate, checkOutDate);
        return overlappingReservations.isEmpty();
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

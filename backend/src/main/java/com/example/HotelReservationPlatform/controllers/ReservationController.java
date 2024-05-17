package com.example.HotelReservationPlatform.controllers;

import com.example.HotelReservationPlatform.entities.Reservation;
import com.example.HotelReservationPlatform.model.ReservationDTO;
import com.example.HotelReservationPlatform.model.ReservationUpdateDTO;
import com.example.HotelReservationPlatform.services.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping
    public ResponseEntity<Reservation> createReservation(@RequestBody ReservationDTO reservationDTO) {
        Reservation reservation = reservationService.createReservation(reservationDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(reservation);
    }

    @PutMapping("/{reservationId}")
    public ResponseEntity<Reservation> updateReservation(@PathVariable Long reservationId,
                                                         @RequestBody ReservationUpdateDTO reservationDTO) {
        Optional<Reservation> updatedReservation = reservationService.updateReservation(reservationId, reservationDTO);
        if (updatedReservation.isPresent()) {
            return ResponseEntity.ok(updatedReservation.get());
        } else {
            return ResponseEntity.ok().build(); // For cancellation, no content to return
        }
    }

    @DeleteMapping("/{reservationId}")
    public ResponseEntity<Void> deleteReservation(@PathVariable Long reservationId) {
        boolean deleted = reservationService.deleteReservation(reservationId);
        if (deleted) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
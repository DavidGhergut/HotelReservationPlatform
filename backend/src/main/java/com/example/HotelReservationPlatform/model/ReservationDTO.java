package com.example.HotelReservationPlatform.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationDTO {
    private Long hotelId;
    private List<Long> roomIds;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private String action; // "create", "cancel", or "change"
}

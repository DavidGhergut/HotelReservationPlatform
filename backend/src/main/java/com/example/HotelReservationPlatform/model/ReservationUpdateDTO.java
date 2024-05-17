package com.example.HotelReservationPlatform.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservationUpdateDTO {
    private String action; // "cancel" or "change"
    private List<Long> roomIds;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
}

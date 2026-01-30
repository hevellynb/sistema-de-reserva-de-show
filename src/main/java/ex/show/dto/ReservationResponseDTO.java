package ex.show.dto;

import ex.show.model.entity.ReservationStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ReservationResponseDTO(
        Long id,
        String show,
        Integer quantidade,
        BigDecimal valorTotal,
        ReservationStatus status,
        LocalDateTime dataReserva
) {}

package ex.show.dto;

import ex.show.model.entity.PaymentMethod;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PaymentResponseDTO(
        Long id,
        Long reservationId,
        BigDecimal valor,
        PaymentMethod metodo,
        LocalDateTime dataPagamento,
        Boolean confirmado
) {}

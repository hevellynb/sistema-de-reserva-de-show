package ex.show.dto;

import ex.show.model.entity.PaymentMethod;

public record CreatePaymentDTO(
        Long reservationId,
        PaymentMethod metodo
) {}

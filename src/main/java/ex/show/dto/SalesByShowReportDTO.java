package ex.show.dto;

import java.math.BigDecimal;

public record SalesByShowReportDTO(
        Long showId,
        String showNome,
        Long totalReservas,
        Long totalIngressos,
        BigDecimal faturamento
) {}

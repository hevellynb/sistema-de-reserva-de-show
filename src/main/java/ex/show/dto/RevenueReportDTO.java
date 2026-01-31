package ex.show.dto;

import java.math.BigDecimal;

public record RevenueReportDTO(
        Long totalReservas,
        BigDecimal faturamentoTotal
) {}

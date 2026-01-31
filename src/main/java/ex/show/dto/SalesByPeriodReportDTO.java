package ex.show.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record SalesByPeriodReportDTO(
        LocalDateTime data,
        Long totalReservas,
        BigDecimal faturamento
) {}

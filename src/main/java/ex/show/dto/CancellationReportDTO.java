package ex.show.dto;

import java.math.BigDecimal;

public record CancellationReportDTO(
        Long totalCancelamentos,
        BigDecimal valorEstornado
) {}

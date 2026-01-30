package ex.show.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ShowDTO(
        String nome,
        String descricao,
        LocalDateTime dataHora,
        String local,
        Integer totalIngressos,
        BigDecimal preco,
        Long categoryId
) {}

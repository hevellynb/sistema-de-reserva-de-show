package ex.show.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ShowResponseDTO(
        Long id,
        String nome,
        String descricao,
        LocalDateTime dataHora,
        String local,
        Integer totalIngressos,
        Integer ingressosDisponiveis,
        BigDecimal preco,
        Long categoryId,
        String categoria
) {}

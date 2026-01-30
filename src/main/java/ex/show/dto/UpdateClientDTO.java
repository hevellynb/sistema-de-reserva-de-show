package ex.show.dto;

public record UpdateClientDTO(
        String nome,
        String email,
        String senha,
        Boolean ativo
) {}

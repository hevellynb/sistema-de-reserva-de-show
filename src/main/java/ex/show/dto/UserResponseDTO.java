package ex.show.dto;

import ex.show.model.entity.Role;

public record UserResponseDTO(
        Long id,
        String nome,
        String email,
        Role role,
        Boolean ativo
) { }

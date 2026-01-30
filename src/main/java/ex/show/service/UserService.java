package ex.show.service;

import ex.show.dto.CreateClientDTO;
import ex.show.dto.UpdateClientDTO;
import ex.show.dto.UserResponseDTO;
import ex.show.model.entity.Role;
import ex.show.model.entity.User;
import ex.show.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder encoder;

    public UserService(UserRepository repository, PasswordEncoder encoder) {
        this.repository = repository;
        this.encoder = encoder;
    }

    public UserResponseDTO createClient(CreateClientDTO dto) {

        if (repository.existsByEmail(dto.email())) {
            throw new RuntimeException("Email já cadastrado");
        }

        User client = new User();
        client.setNome(dto.nome());
        client.setEmail(dto.email());
        client.setSenha(encoder.encode(dto.senha()));
        client.setRole(Role.CLIENTE);
        client.setAtivo(true);

        User saved = repository.save(client);

        return new UserResponseDTO(
            saved.getId(),
            saved.getNome(),
            saved.getEmail(),
            saved.getRole(),
            saved.getAtivo()
        );
    }

    public void deactivateClient(Long id) {
        User user = repository.findById(id).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
        user.setAtivo(false);
        repository.save(user);
    }

    public void deleteClient(Long id) {
        repository.deleteById(id);
    }

    public UserResponseDTO getClientById(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return toDTO(user);
    }

    public List<UserResponseDTO> listClients() {
        return repository.findAll().stream()
                .filter(u -> u.getRole() == Role.CLIENTE)
                .map(this::toDTO)
                .toList();
    }

    public UserResponseDTO updateClient(Long id, UpdateClientDTO dto) {

        User user = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (dto.nome() != null) {
            user.setNome(dto.nome());
        }

        if (dto.email() != null) {
            user.setEmail(dto.email());
        }

        if (dto.senha() != null && !dto.senha().isBlank()) {
            user.setSenha(encoder.encode(dto.senha()));
        }

        if (dto.ativo() != null) {
            user.setAtivo(dto.ativo());
        }

        User saved = repository.save(user);
        return toDTO(saved);
    }

    private UserResponseDTO toDTO(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getNome(),
                user.getEmail(),
                user.getRole(),
                user.getAtivo()
        );
    }
}

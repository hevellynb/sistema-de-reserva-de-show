package ex.show.controller;

import ex.show.dto.LoginRequestDTO;
import ex.show.dto.TokenResponseDTO;
import ex.show.model.entity.User;
import ex.show.repository.UserRepository;
import ex.show.service.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthenticationManager authManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authManager, JwtService jwtService, UserRepository userRepository) {
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public TokenResponseDTO login(@RequestBody LoginRequestDTO request) {

        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.senha()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // 2. Geramos o token usando o objeto de usuário
        String token = jwtService.generateToken(userDetails);

        // 3. Pegamos a Role (Papel) do usuário
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_CLIENTE");

        Long userId = userRepository.findByEmail(userDetails.getUsername())
                .map(user -> user.getId()) // Pega o ID da sua entidade User
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        // 4. Retornamos o Token, a Role e o ID
        return new TokenResponseDTO(token, role, userId);
    }
}

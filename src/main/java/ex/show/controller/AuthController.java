package ex.show.controller;

import ex.show.dto.CreateClientDTO;
import ex.show.dto.LoginRequestDTO;
import ex.show.dto.TokenResponseDTO;
import ex.show.dto.UserResponseDTO;
import ex.show.repository.UserRepository;
import ex.show.service.JwtService;
import ex.show.service.UserService;
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
    private final UserService userService;

    public AuthController(AuthenticationManager authManager, JwtService jwtService, UserRepository userRepository, UserService userService) {
        this.authManager = authManager;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.userService = userService;
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

        String token = jwtService.generateToken(userDetails);

        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_CLIENTE");

        Long userId = userRepository.findByEmail(userDetails.getUsername())
                .map(user -> user.getId())
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return new TokenResponseDTO(token, role, userId);
    }

    @PostMapping("/register")
    public UserResponseDTO register(@RequestBody CreateClientDTO dto) {
        return userService.createClient(dto);
    }
}

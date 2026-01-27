package ex.show.config;

import ex.show.model.entity.Role;
import ex.show.model.entity.User;
import ex.show.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initAdmin(
            UserRepository repository,
            PasswordEncoder encoder
    ) {
        return args -> {
            if (repository.findByEmail("admin@admin.com").isEmpty()) {
                User admin = new User();
                admin.setNome("admin");
                admin.setEmail("admin@admin.com");
                admin.setSenha(encoder.encode("admin"));
                admin.setRole(Role.ADMIN);
                admin.setAtivo(true);

                repository.save(admin);
            }
        };
    }
}

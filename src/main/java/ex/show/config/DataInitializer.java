package ex.show.config;

import ex.show.model.entity.*;
import ex.show.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Configuration
public class DataInitializer {


    @Bean
    CommandLineRunner initData(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ShowRepository showRepository,
            ReservationRepository reservationRepository,
            RefundRepository refundRepository,
            PasswordEncoder encoder

    ) {
        return args -> {
            User admin = userRepository.findByEmail("admin@admin.com")
                    .orElseGet(() -> {
                        User u = new User();
                        u.setNome("Admin");
                        u.setEmail("admin@admin.com");
                        u.setSenha(encoder.encode("admin"));
                        u.setRole(Role.ADMIN);
                        u.setAtivo(true);
                        return userRepository.save(u);
                    });

            if (userRepository.count() < 3) {

                User cliente1 = userRepository.save(new User(
                        null,
                        "Maria Silva",
                        "maria@email.com",
                        encoder.encode("123"),
                        Role.CLIENTE,
                        true
                ));

                User cliente2 = userRepository.save(new User(
                        null,
                        "João Souza",
                        "joao@email.com",
                        encoder.encode("123"),
                        Role.CLIENTE,
                        true
                ));

                Category rock = categoryRepository.save(
                        new Category(null, "Rock", true)
                );

                Category pop = categoryRepository.save(
                        new Category(null, "Pop", true)
                );

                Show show1 = new Show();
                show1.setNome("Rock Festival");
                show1.setCategory(rock);
                show1.setDataHora(LocalDateTime.now().plusDays(10));
                show1.setPreco(new BigDecimal("150"));
                show1.setIngressosDisponiveis(100);
                show1.setAtivo(true);

                Show show2 = new Show();
                show2.setNome("Pop Night");
                show2.setCategory(pop);
                show2.setDataHora(LocalDateTime.now().plusDays(20));
                show2.setPreco(new BigDecimal("120"));
                show2.setIngressosDisponiveis(80);
                show2.setAtivo(true);

                showRepository.saveAll(List.of(show1, show2));

                Reservation r1 = new Reservation();
                r1.setUser(cliente1);
                r1.setShow(show1);
                r1.setQuantidade(2);
                r1.setValorTotal(show1.getPreco().multiply(BigDecimal.valueOf(2)));
                r1.setStatus(ReservationStatus.PENDENTE);
                r1.setDataReserva(LocalDateTime.now());

                reservationRepository.save(r1);

                Reservation r2 = new Reservation();
                r2.setUser(cliente2);
                r2.setShow(show2);
                r2.setQuantidade(3);
                r2.setValorTotal(show2.getPreco().multiply(BigDecimal.valueOf(3)));
                r2.setStatus(ReservationStatus.APROVADA);
                r2.setDataReserva(LocalDateTime.now().minusDays(1));

                reservationRepository.save(r2);

                Reservation r3 = new Reservation();
                r3.setUser(cliente1);
                r3.setShow(show1);
                r3.setQuantidade(1);
                r3.setValorTotal(show1.getPreco());
                r3.setStatus(ReservationStatus.CANCELADA);
                r3.setDataReserva(LocalDateTime.now().minusDays(2));

                reservationRepository.save(r3);

                Refund refund = new Refund();
                refund.setReservation(r3);
                refund.setValor(r3.getValorTotal());
                refund.setDataEstorno(LocalDateTime.now().minusDays(2));
                refund.setStatus(RefundStatus.PROCESSADO);

                refundRepository.save(refund);

            }
        };
    }
}

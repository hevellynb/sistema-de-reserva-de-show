package ex.show.repository;

import ex.show.model.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    boolean existsByReservationId(Long reservationId);
}

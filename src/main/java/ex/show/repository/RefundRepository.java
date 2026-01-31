package ex.show.repository;

import ex.show.model.entity.Refund;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefundRepository extends JpaRepository<Refund, Long> {
    boolean existsByReservationId(Long reservationId);
}

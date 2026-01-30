package ex.show.repository;

import ex.show.model.entity.Reservation;
import ex.show.model.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long id);
    List<Reservation> findByStatus(ReservationStatus status);
}

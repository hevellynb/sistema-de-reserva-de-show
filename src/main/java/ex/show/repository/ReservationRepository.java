package ex.show.repository;

import ex.show.dto.CancellationReportDTO;
import ex.show.dto.RevenueReportDTO;
import ex.show.dto.SalesByPeriodReportDTO;
import ex.show.dto.SalesByShowReportDTO;
import ex.show.model.entity.Reservation;
import ex.show.model.entity.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByUserId(Long id);
    List<Reservation> findByStatus(ReservationStatus status);

    @Query("""
        SELECT new ex.show.dto.SalesByShowReportDTO(
            s.id,
            s.nome,
            COUNT(r.id),
            SUM(r.quantidade),
            SUM(r.valorTotal)
        )
        FROM Reservation r
        JOIN r.show s
        WHERE r.status = 'APROVADA'
        GROUP BY s.id, s.nome
    """)
    List<SalesByShowReportDTO> salesByShow();

    @Query("""
    SELECT new ex.show.dto.RevenueReportDTO(
        COUNT(r.id),
        SUM(r.valorTotal)
    )
    FROM Reservation r
    WHERE r.status = 'APROVADA' 
    """)
    RevenueReportDTO totalRevenue();

    @Query("""
    SELECT new ex.show.dto.SalesByPeriodReportDTO(
        r.dataReserva,
        COUNT(r.id),
        SUM(r.valorTotal)
    )
    FROM Reservation r
    WHERE r.status = 'APROVADA'
    AND r.dataReserva BETWEEN :inicio AND :fim
    GROUP BY r.dataReserva
    ORDER BY r.dataReserva
""")
    List<SalesByPeriodReportDTO> salesByPeriod(@Param("inicio") LocalDateTime inicio, @Param("fim") LocalDateTime fim);

    @Query("""
        SELECT new ex.show.dto.CancellationReportDTO(
            COUNT(r.id),
            SUM(r.valorTotal)
        )
        FROM Reservation r
        WHERE r.status = 'CANCELADA'
    """)
    CancellationReportDTO cancellationReport();
}

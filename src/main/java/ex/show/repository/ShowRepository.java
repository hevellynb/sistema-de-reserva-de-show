package ex.show.repository;

import ex.show.model.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface ShowRepository extends JpaRepository<Show, Long> {
    List<Show> findByAtivoTrue();

    @Query("""

        SELECT s FROM Show s
        WHERE s.ativo = true
        AND (:categoryId IS NULL OR s.category.id = :categoryId)
        AND (:local IS NULL OR LOWER(s.local) LIKE LOWER(CONCAT('%', :local, '%')))
        AND (:inicio IS NULL OR s.dataHora >= :inicio)
        AND (:fim IS NULL OR s.dataHora <= :fim)
        AND (:precoMin IS NULL OR s.preco >= :precoMin)
        AND (:precoMax IS NULL OR s.preco <= :precoMax)
    """)

    List<Show> search(
            @Param("categoryId") Long categoryId,
            @Param("local") String local,
            @Param("inicio") LocalDateTime inicio,
            @Param("fim") LocalDateTime fim,
            @Param("precoMin") BigDecimal precoMin,
            @Param("precoMax") BigDecimal precoMax
            );
}

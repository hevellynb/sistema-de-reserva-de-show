package ex.show.repository;

import ex.show.model.entity.Show;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ShowRepository extends JpaRepository<Show, Long> {
    List<Show> findByAtivoTrue();
    List<Show> findByCategoryIdAndAtivoTrue(Long categoryId);
    List<Show> findByDataHoraBetweenAndAtivoTrue(LocalDateTime inicio, LocalDateTime fim);
}

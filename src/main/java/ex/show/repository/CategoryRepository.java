package ex.show.repository;

import ex.show.model.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByNome(String nome);
    Optional<Category> findByNome(String nome);
}

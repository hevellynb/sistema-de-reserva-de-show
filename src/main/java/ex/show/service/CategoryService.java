package ex.show.service;

import ex.show.dto.CategoryDTO;
import ex.show.dto.CategoryResponseDTO;
import ex.show.model.entity.Category;
import ex.show.model.entity.Show;
import ex.show.repository.CategoryRepository;
import ex.show.repository.ShowRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private CategoryRepository repository;
    private final ShowRepository showRepository;

    public CategoryService(CategoryRepository repository, ShowRepository showRepository) {
        this.repository = repository;
        this.showRepository = showRepository;
    }

    public CategoryResponseDTO create(CategoryDTO dto) {

        if (repository.existsByNome(dto.nome())) {
            throw new RuntimeException("Categoria já existe");
        }

        Category category = new Category();
        category.setNome(dto.nome());
        category.setAtivo(true);

        Category saved = repository.save(category);

        return new CategoryResponseDTO(
                saved.getId(),
                saved.getNome(),
                saved.getAtivo()
        );
    }

    public List<CategoryResponseDTO> list() {
        return repository.findAll().stream()
                .filter(Category::getAtivo)
                .map(c -> new CategoryResponseDTO(
                        c.getId(),
                        c.getNome(),
                        c.getAtivo()
                )).toList();
    }

    public CategoryResponseDTO update(Long id, CategoryDTO dto) {
        Category category = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        category.setNome(dto.nome());

        Category saved = repository.save(category);

        return new CategoryResponseDTO(
                category.getId(),
                category.getNome(),
                category.getAtivo()
        );
    }

    @Transactional
    public void deactivate(Long id) {
        Category category = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        Category categoriaGeral = repository.findByNome("Geral")
                .orElseGet(() -> {
                    Category nova = new Category();
                    nova.setNome("Geral");
                    nova.setAtivo(false);
                    return repository.save(nova);
                });

        if (category.getId().equals(categoriaGeral.getId())) {
            throw new RuntimeException("Não é possível excluir a categoria de reserva.");
        }

        List<Show> showsParaMover = showRepository.findByCategoryId(id);

        for (Show show : showsParaMover) {
            show.setCategory(categoriaGeral);
        }
        showRepository.saveAll(showsParaMover);

        category.setAtivo(false);
        repository.save(category);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}

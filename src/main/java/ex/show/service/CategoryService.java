package ex.show.service;

import ex.show.dto.CategoryDTO;
import ex.show.dto.CategoryResponseDTO;
import ex.show.model.entity.Category;
import ex.show.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private CategoryRepository repository;

    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    public CategoryResponseDTO create(CategoryDTO dto) {

        if (repository.existsByNome(dto.nome())) {
            throw new RuntimeException("Categoria já existe");
        }

        Category category = new Category();
        category.setNome(dto.nome());

        Category saved = repository.save(category);

        return new CategoryResponseDTO(
                saved.getId(),
                saved.getNome(),
                saved.getAtivo()
        );
    }

    public List<CategoryResponseDTO> list() {
        return repository.findAll().stream()
                .map(c -> new CategoryResponseDTO(
                        c.getId(),
                        c.getNome(),
                        c.getAtivo()
                )).toList();
    }

    public CategoryResponseDTO update(Long id, CategoryDTO dto) {
        Category category = repository.findById(id).orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        category.setNome(dto.nome());

        return new CategoryResponseDTO(
                category.getId(),
                category.getNome(),
                category.getAtivo()
        );
    }

    public void deactivate(Long id) {
        Category category = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        category.setAtivo(false);
        repository.save(category);
    }

    public void delete(Long id) {
        repository.deleteById(id);
    }
}

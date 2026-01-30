package ex.show.service;

import ex.show.dto.ShowDTO;
import ex.show.dto.ShowResponseDTO;
import ex.show.model.entity.Category;
import ex.show.model.entity.Show;
import ex.show.repository.CategoryRepository;
import ex.show.repository.ShowRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowService {

    private final ShowRepository showRepository;
    private final CategoryRepository categoryRepository;

    public ShowService(ShowRepository showRepository, CategoryRepository categoryRepository) {
        this.showRepository = showRepository;
        this.categoryRepository = categoryRepository;
    }

    public ShowResponseDTO create(ShowDTO dto) {
        Category category = categoryRepository.findById(dto.categoryId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        Show show = new Show();
        show.setNome(dto.nome());
        show.setDescricao(dto.descricao());
        show.setDataHora(dto.dataHora());
        show.setLocal(dto.local());
        show.setTotalIngressos(dto.totalIngressos());
        show.setIngressosDisponiveis(dto.totalIngressos());
        show.setPreco(dto.preco());
        show.setCategory(category);

        Show saved = showRepository.save(show);

        return toDTO(saved);
    }

    public List<ShowResponseDTO> list() {
        return showRepository.findByAtivoTrue().stream()
                .map(this::toDTO)
                .toList();
    }

    public ShowResponseDTO getById(Long id) {
        Show show = showRepository.findById(id)
                .filter(Show::getAtivo)
                .orElseThrow(() -> new RuntimeException("Show não encontrado"));
        return toDTO(show);
    }

    public ShowResponseDTO update(Long id, ShowDTO dto) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Show não encontrado"));

        if (dto.nome() != null) {
            show.setNome(dto.nome());
        }
        if (dto.descricao() != null) {
            show.setDescricao(dto.descricao());
        }
        if (dto.dataHora() != null) {
            show.setDataHora(dto.dataHora());
        }
        if (dto.local() != null) {
            show.setLocal(dto.local());
        }
        if (dto.preco() != null) {
            show.setPreco(dto.preco());
        }

        if (dto.categoryId() != null) {
            Category category = categoryRepository.findById(dto.categoryId())
                    .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));
            show.setCategory(category);
        }

        return toDTO(showRepository.save(show));
    }

    public void deactivate(Long id) {
        Show show = showRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Show não encontrado"));

        show.setAtivo(false);
        showRepository.save(show);
    }

    public void delete(Long id) {
        showRepository.deleteById(id);
    }

    private ShowResponseDTO toDTO(Show show) {
        return new ShowResponseDTO(
                show.getId(),
                show.getNome(),
                show.getDescricao(),
                show.getDataHora(),
                show.getLocal(),
                show.getIngressosDisponiveis(),
                show.getPreco(),
                show.getCategory().getNome()
        );
    }
}

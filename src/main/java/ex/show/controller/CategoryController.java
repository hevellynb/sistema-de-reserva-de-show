package ex.show.controller;

import ex.show.dto.CategoryDTO;
import ex.show.dto.CategoryResponseDTO;
import ex.show.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class CategoryController {

    private CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    @PostMapping
    public CategoryResponseDTO create(@RequestBody CategoryDTO dto) {
        return service.create(dto);
    }

    @GetMapping
    public List<CategoryResponseDTO> list() {
        return service.list();
    }

    @PutMapping("/{id}")
    public CategoryResponseDTO update(@PathVariable Long id, @RequestBody CategoryDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deactivate(@PathVariable Long id) {
        service.deactivate(id);
    }
    
}

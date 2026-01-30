package ex.show.controller;

import ex.show.dto.ShowResponseDTO;
import ex.show.service.ShowService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/shows")
public class ShowController {

    private final ShowService service;

    public ShowController(ShowService service) {
        this.service = service;
    }

    @GetMapping
    public List<ShowResponseDTO> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public ShowResponseDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }
}

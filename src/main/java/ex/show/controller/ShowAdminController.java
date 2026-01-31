package ex.show.controller;

import ex.show.dto.ShowDTO;
import ex.show.dto.ShowResponseDTO;
import ex.show.service.ShowService;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/shows")
@PreAuthorize("hasRole('ADMIN')")
public class ShowAdminController {

    private final ShowService service;

    public ShowAdminController(ShowService service) {
        this.service = service;
    }

    @PostMapping
    public ShowResponseDTO create(@RequestBody ShowDTO dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public ShowResponseDTO update(@PathVariable Long id, @RequestBody ShowDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivate(@PathVariable Long id) {
        service.deactivate(id);
    }
}

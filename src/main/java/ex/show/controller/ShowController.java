package ex.show.controller;

import ex.show.dto.ShowDTO;
import ex.show.dto.ShowResponseDTO;
import ex.show.service.ShowService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/shows")
public class ShowController {

    private final ShowService service;

    public ShowController(ShowService service) {
        this.service = service;
    }

    @GetMapping("/{id}")
    public ShowResponseDTO getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping
    public List<ShowResponseDTO> search(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String local,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate data,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim,
            @RequestParam(required = false) BigDecimal precoMin,
            @RequestParam(required = false) BigDecimal precoMax
            ) {
        return service.search(categoryId, local, data, inicio, fim, precoMin, precoMax);
    }

}

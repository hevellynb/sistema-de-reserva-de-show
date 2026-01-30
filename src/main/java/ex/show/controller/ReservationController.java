package ex.show.controller;

import ex.show.dto.CreateReservationDTO;
import ex.show.dto.ReservationResponseDTO;
import ex.show.service.ReservationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    @PostMapping
    public ReservationResponseDTO create(
            @RequestParam Long userId,
            @RequestBody CreateReservationDTO dto) {
        return service.createReservation(userId, dto);
    }

    @GetMapping
    public List<ReservationResponseDTO> list(
            @RequestParam Long userId) {
        return service.listByUser(userId);
    }
}

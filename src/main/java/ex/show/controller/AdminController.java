package ex.show.controller;

import ex.show.dto.CreateClientDTO;
import ex.show.dto.UpdateClientDTO;
import ex.show.dto.UserResponseDTO;
import ex.show.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;

    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/clients")
    @ResponseStatus(HttpStatus.CREATED)
    public UserResponseDTO createClient(@RequestBody CreateClientDTO dto) {
        return userService.createClient(dto);
    }

    @GetMapping("/clients")
    public List<UserResponseDTO> listClients() {
        return userService.listClients();
    }

    @GetMapping("/clients/{id}")
    public UserResponseDTO getClient(@PathVariable Long id) {
        return userService.getClientById(id);
    }

    @PutMapping("/clients/{id}")
    public UserResponseDTO updateClient(@PathVariable Long id, @RequestBody UpdateClientDTO dto) {
        return userService.updateClient(id, dto);
    }

    @DeleteMapping("/clients/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deactivateClient(@PathVariable Long id) {
        userService.deactivateClient(id);
    }
}

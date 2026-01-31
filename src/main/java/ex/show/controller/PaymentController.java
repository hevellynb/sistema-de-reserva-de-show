package ex.show.controller;

import ex.show.dto.CreatePaymentDTO;
import ex.show.dto.PaymentResponseDTO;
import ex.show.service.PaymentService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @PostMapping
    public PaymentResponseDTO pay(@RequestBody CreatePaymentDTO dto) {
        return service.pay(dto);
    }
}

package ex.show.service;

import ex.show.dto.CreatePaymentDTO;
import ex.show.dto.PaymentResponseDTO;
import ex.show.model.entity.Payment;
import ex.show.model.entity.Reservation;
import ex.show.model.entity.ReservationStatus;
import ex.show.repository.PaymentRepository;
import ex.show.repository.ReservationRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final ReservationRepository reservationRepository;

    public PaymentService(PaymentRepository paymentRepository, ReservationRepository reservationRepository) {
        this.paymentRepository = paymentRepository;
        this.reservationRepository = reservationRepository;
    }

    @Transactional
    public PaymentResponseDTO pay(CreatePaymentDTO dto) {

        Reservation reservation = reservationRepository.findById(dto.reservationId())
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        if (reservation.getStatus() != ReservationStatus.PENDENTE) {
            throw new RuntimeException("Reserva não pode ser paga.");
        }

        if (paymentRepository.existsByReservationId(reservation.getId())) {
            throw  new RuntimeException("Pagamento já realizado.");
        }

        Payment payment = new Payment();
        payment.setReservation(reservation);
        payment.setValor(reservation.getValorTotal());
        payment.setMetodo(dto.metodo());
        payment.setDataPagamento(LocalDateTime.now());
        payment.setConfirmado(true);

        reservation.setStatus(ReservationStatus.APROVADA);

        paymentRepository.save(payment);

        return toDTO(payment);
    }

    private PaymentResponseDTO toDTO(Payment p) {
        return new PaymentResponseDTO(
                p.getId(),
                p.getReservation().getId(),
                p.getValor(),
                p.getMetodo(),
                p.getDataPagamento(),
                p.getConfirmado()
        );
    }
}

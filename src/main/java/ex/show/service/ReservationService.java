package ex.show.service;

import ex.show.dto.CreateReservationDTO;
import ex.show.dto.ReservationResponseDTO;
import ex.show.model.entity.*;
import ex.show.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final UserRepository userRepository;
    private final ShowRepository showRepository;
    private final RefundRepository refundRepository;
    private final PaymentRepository paymentRepository;

    public ReservationService(ReservationRepository reservationRepository, UserRepository userRepository, ShowRepository showRepository,  RefundRepository refundRepository, PaymentRepository paymentRepository) {
        this.reservationRepository = reservationRepository;
        this.userRepository = userRepository;
        this.showRepository = showRepository;
        this.refundRepository = refundRepository;
        this.paymentRepository = paymentRepository;
    }

    @Transactional
    public ReservationResponseDTO createReservation(
            Long userId,
            CreateReservationDTO dto) {

        Show show = showRepository.findById(dto.showId())
                .orElseThrow(() -> new RuntimeException("Show não encontrado"));

        if (dto.quantidade() <= 0) {
            throw new RuntimeException("A quantidade de ingressos deve ser pelo menos 1.");
        }

        if (!show.getAtivo()) {
            throw new RuntimeException("Show indisponível");
        }

        if(show.getIngressosDisponiveis() < dto.quantidade()) {
            throw new RuntimeException("Quantidade de ingressos insuficiente");
        }

        show.setIngressosDisponiveis(show.getIngressosDisponiveis() - dto.quantidade());
        showRepository.save(show);

        Reservation reservation = new Reservation();
        reservation.setUser(
                userRepository.findById(userId)
                        .orElseThrow(() -> new RuntimeException("Usuário não encontrado"))
        );
        reservation.setShow(show);
        reservation.setQuantidade(dto.quantidade());
        reservation.setValorTotal(
                show.getPreco().multiply(
                        BigDecimal.valueOf(dto.quantidade())
                )
        );

        reservation.setDataReserva(LocalDateTime.now());
        reservation.setStatus(ReservationStatus.PENDENTE);

        reservationRepository.save(reservation);

        return toDTO(reservation);
    }

    public List<ReservationResponseDTO> listByUser(Long userId) {
        return reservationRepository.findByUserId(userId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    @Transactional
    public void cancel(Long reservationId) {

        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        if (reservation.getStatus() == ReservationStatus.CANCELADA) {
            throw new RuntimeException("Reserva já cancelada.");
        }

        Show show = reservation.getShow();
        show.setIngressosDisponiveis(
                show.getIngressosDisponiveis() + reservation.getQuantidade()
        );

        if (reservation.getStatus() == ReservationStatus.APROVADA) {

            if (!refundRepository.existsByReservationId(reservationId)) {
                Refund refund = new Refund();
                refund.setReservation(reservation);
                refund.setValor(reservation.getValorTotal());
                refund.setDataEstorno(LocalDateTime.now());
                refund.setStatus(RefundStatus.PROCESSADO);

                refundRepository.save(refund);
            }
        }

        reservation.setStatus(ReservationStatus.CANCELADA);

        showRepository.save(show);
        reservationRepository.save(reservation);
    }

    @Transactional
    public void confirmarPagamentoPeloCliente(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new RuntimeException("Reserva não encontrada"));

        reservation.setStatus(ReservationStatus.APROVADA);
        reservationRepository.save(reservation);

        paymentRepository.findByReservationId(reservationId).ifPresent(p -> {
            p.setConfirmado(true);
            paymentRepository.save(p);
        });
    }

    private ReservationResponseDTO toDTO(Reservation r) {
        return new ReservationResponseDTO(
                r.getId(),
                r.getShow().getNome(),
                r.getQuantidade(),
                r.getValorTotal(),
                r.getStatus(),
                r.getShow().getDataHora()
        );
    }

    public List<ReservationResponseDTO> listAll() {
        return reservationRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}

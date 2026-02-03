package ex.show.controller;

import ex.show.dto.CancellationReportDTO;
import ex.show.dto.RevenueReportDTO;
import ex.show.dto.SalesByPeriodReportDTO;
import ex.show.dto.SalesByShowReportDTO;
import ex.show.repository.ReservationRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/admin/reports")
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    private final ReservationRepository reservationRepository;

    public ReportController(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @GetMapping("/sales-by-show")
    public List<SalesByShowReportDTO> salesByShow() {
        return reservationRepository.salesByShow();
    }

    @GetMapping("/revenue")
    public RevenueReportDTO revenue() {
        return reservationRepository.totalRevenue();
    }

    @GetMapping("/sales-by-period")
    public List<SalesByPeriodReportDTO> salesByPeriod(
            @RequestParam LocalDateTime inicio,
            @RequestParam LocalDateTime fim
    ) {
        return reservationRepository.salesByPeriod(inicio, fim);
    }

    @GetMapping("/cancellations")
    public CancellationReportDTO cancellations() {
        return reservationRepository.cancellationReport();
    }
}

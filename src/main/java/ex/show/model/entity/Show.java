package ex.show.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "shows")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Show {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;

    @Column(length = 500)
    private String descricao;

    private LocalDateTime dataHora;

    private String local;

    private Integer totalIngressos;

    private Integer ingressosDisponiveis;

    private BigDecimal preco;

    private Boolean ativo = true;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}

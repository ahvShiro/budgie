package br.com.shiroshima.budgiebackend.models;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import br.com.shiroshima.budgiebackend.models.enums.TransactionType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Entity
@Table(name = "transactions")
@Data
@EntityListeners(AuditingEntityListener.class)
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id")
    private Wallet wallet;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY, optional = true) // VER QUAIS RELACIONAMENTO SAO OBRIGATORIOS E USAR
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @PositiveOrZero
    @Column(precision = 19, scale = 2)
    @NotNull
    private BigDecimal value;

    private String description;

    private LocalDate date;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
   // Você pode adicionar anexo, observações, recorrência etc.
}

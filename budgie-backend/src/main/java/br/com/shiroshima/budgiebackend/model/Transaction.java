package br.com.shiroshima.budgiebackend.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import br.com.shiroshima.budgiebackend.model.enums.TransactionType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "transaction")
@Data
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne
    private Wallet wallet;
    
    @ManyToOne
    private Category category;

    @ManyToOne
    private User createdBy;

    private TransactionType type;

    private BigDecimal value;

    private String description;

    private LocalDate date;

    private LocalDateTime createdAt;
    
   // Você pode adicionar anexo, observações, recorrência etc.
}

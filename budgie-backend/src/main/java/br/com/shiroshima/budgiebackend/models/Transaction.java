package br.com.shiroshima.budgiebackend.models;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
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
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@EntityListeners(AuditingEntityListener.class)
public class Transaction {

    public Transaction(Wallet wallet, Category category, User createdBy, TransactionType type, BigDecimal value, String description, LocalDate date)
    {
        this.wallet = wallet;
        this.category = category;
        this.createdBy = createdBy;
        this.type = type;
        this.value = value;
        this.description = description;
        this.date = date;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "wallet_id")
    @NotNull(message = "{wallet.shouldrequired}")
    private Wallet wallet;

    // PODE ter categoria sem lançamento
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    @NotNull(message = "{createdby.shouldrequired}")
    private User createdBy;

    @NotNull(message = "{type.shouldrequired}")
    @Enumerated(EnumType.STRING)
    private TransactionType type;

    @NotNull(message = "{value.shouldrequired}")
    @DecimalMin(value = "0.01", message = "{value.shouldpositive}")
    @Column(precision = 19, scale = 2)
    private BigDecimal value;

    @Size(max = 128, message = "{description.shouldmax}")
    private String description;

    @NotNull(message = "{date.shouldrequired}")
    @PastOrPresent(message = "{date.shouldpastorpresent}")
    private LocalDate date;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "active")
    private boolean active = true;

   // Você pode adicionar anexo, observações, recorrência etc.
}

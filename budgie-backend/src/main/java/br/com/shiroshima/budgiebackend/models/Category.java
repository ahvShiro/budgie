package br.com.shiroshima.budgiebackend.models;

import org.hibernate.validator.constraints.URL;

import br.com.shiroshima.budgiebackend.models.enums.TransactionType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name="categories")
@Data
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    @NotNull
    private User user;

    @NotBlank(message = "{name.required}")
    private String name;

    @Column(name = "transaction_type")
    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;

    @Pattern(regexp = "^[0-9a-fA-F]*$", message = "{color.shouldvalid}")
    @Size(max = 6, message = "{color.shouldmax}")
    private String color;

    @URL(message = "{icon.shouldvalid}")
    private String icon;

    @Column(name = "is_active")
    private boolean isActive = true;
}

package br.com.shiroshima.budgiebackend.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.ToString;

@Entity
@Table(name = "wallet")
@Data
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne
    private User owner;

    @NotBlank
    @Size(min = 2, max = 64, message = "Wallet name must have at least 2 and at most 64 characters")
    private String name;
    
    @Size(max = 128, message = "Wallet description must have at most 128 characters")
    private String description;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @OneToMany
    @ToString.Exclude
    private List<WalletMember> members;
    
    @OneToMany
    @ToString.Exclude
    private List<Transaction> transactions;
}

/*
Você pode adicionar moeda, saldo inicial, cor etc.
*/
package br.com.shiroshima.budgiebackend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;

import br.com.shiroshima.budgiebackend.model.enums.RoleWallet;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "wallet_member")
@Data
public class WalletMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;
   
    @ManyToOne
    private Wallet wallet;

    @ManyToOne
    private User user;

    private RoleWallet role;

    @CreatedDate
    private LocalDateTime createdAt;
    
    // Você pode adicionar convite pendente, data de expiração etc.
}

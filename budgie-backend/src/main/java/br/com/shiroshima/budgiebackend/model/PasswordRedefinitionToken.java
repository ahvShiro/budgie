package br.com.shiroshima.budgiebackend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "password_redefinition_token")
@Data
public class PasswordRedefinitionToken {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne
    private User user;

    private String token;

    private LocalDateTime expiresAt;
    
    private boolean wasAlreadyUsed;
}
// Você pode adicionar IP de origem, tipo de solicitação etc.

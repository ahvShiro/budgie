package br.com.shiroshima.budgiebackend.model;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
@EntityListeners(AuditingEntityListener.class)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @NotBlank(message = "Name should not be blank")
    @Size(min = 2, max = 64, message = "Name should have at least 2 characters and at mos 25 characters")
    private String name;

    @NotBlank(message = "Email should not be blank")
    @Email(message = "Must be a valid email")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "Password should not be blank")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Size(min=8, message = "Password should have at least 8 characters")
    private String password;

    @CreatedDate
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}

package br.com.shiroshima.budgiebackend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @NotBlank
    @Size(min = 2, max = 25, message = "Username should have at least 2 characters and at mos 25 characters")
    private String username;

    @NotBlank
    @JsonIgnore
    @Size(min=8, message = "Password should have at least 8 characters")
    private String password;

}

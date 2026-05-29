package br.com.shiroshima.budgiebackend.model;

import java.util.UUID;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "profiles")
@Data
public class Profile {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false)
    private UUID id;

    @NotBlank
    @Size(min = 2, max = 25, message = "Profile name should have at least 2 characters and at mos 25 characters")
    private String profileName;

}

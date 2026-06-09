package br.com.shiroshima.budgiebackend.model;

import org.hibernate.validator.constraints.URL;

import br.com.shiroshima.budgiebackend.model.enums.TransactionType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name="category")
@Data
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(nullable = false)
    private Long id;

    @ManyToOne
    private User user;

    @NotBlank
    private String name;

    private TransactionType transactionType;

    @Pattern(regexp = "^[0-9a-fA-F]*$", message = "Must be a valid hexadeximal value")
    @Size(max = 6, message = "Color code should have 6 characters")
    private String color;

    @URL(message = "Must be a valid URL")
    private String icon;

    private boolean isActive = true;
}

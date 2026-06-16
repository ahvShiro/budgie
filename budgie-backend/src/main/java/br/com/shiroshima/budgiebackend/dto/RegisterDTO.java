package br.com.shiroshima.budgiebackend.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterDTO {
    @NotBlank(message = "{name.required}")
    @Size(min = 2, max = 64, message = "{name.minmax}")
    private String name;

    @NotBlank(message = "{email.required}")
    @Email(message = "{email.valid}")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "{password.required}")
    @Size(min=8, message = "{password.min}")
    private String password;

    @NotBlank(message = "TODO PARAMETRIZAR")
    @Size(min=8, message = "TODO PARAMETRIZAR")
    private String passwordConfirmation;
}

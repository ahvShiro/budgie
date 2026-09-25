package br.com.shiroshima.budgiebackend.dtos.passwordRecover;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record EmailDTO(
    @NotBlank(message = "{email.shouldrequired}")
    @Email(message = "{email.shouldvalid}")
    String email
) {}

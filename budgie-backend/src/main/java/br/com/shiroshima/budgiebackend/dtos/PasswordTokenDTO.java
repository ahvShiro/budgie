package br.com.shiroshima.budgiebackend.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record PasswordTokenDTO(
    @NotBlank(message = "{token.shouldrequired}")
    String token,

    @NotBlank(message = "{newpassword.shouldrequired}")
    @Size(min = 8, message = "{newpassword.shouldmin}")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).+$",
        message = "{password.shouldstrong}"
    )
    String newPassword,

    @NotBlank(message = "{newpasswordconfirmation.shouldrequired}")
    @Size(min = 8, message = "{newpasswordconfirmation.shouldmin}")
    String newPasswordConfirmation
) {}

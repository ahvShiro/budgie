package br.com.shiroshima.budgiebackend.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UserRegisterDTO(
    @NotBlank(message = "{name.shouldrequired}")
    @Size(min = 2, max = 64, message = "{name.shouldminmax}")
    String name,

    @NotBlank(message="{email.shouldrequired}")
    @Email(message="{email.shouldvalid}")
    String email,

    @NotBlank(message="{password.shouldrequired}")
    @Size(min=8, message="{password.shouldmin}")
    @Pattern(
        regexp="^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\w\\s]).+$", 
        message="{password.shouldstrong}"
    )
    String password,

    @NotBlank(message = "{passwordconfirmation.shouldrequired}")
    @Size(min=8, message = "{passwordconfirmation.shouldmin}")
    String passwordConfirmation

) {}

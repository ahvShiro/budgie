package br.com.shiroshima.budgiebackend.dtos.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserUpdateDTO(
    @NotBlank(message = "{name.shouldrequired}")
    @Size(min = 2, max = 64, message = "{name.shouldminmax}")
    String name
) {}

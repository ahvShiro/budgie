package br.com.shiroshima.budgiebackend.dtos.wallet;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record WalletRegisterDTO(
    @NotBlank(message = "{name.shouldrequired}")
    @Size(min = 2, max = 64, message = "{name.shouldminmax}")
    String name,

    @Size(max = 128, message = "{description.shouldmax}")
    String description
) {}

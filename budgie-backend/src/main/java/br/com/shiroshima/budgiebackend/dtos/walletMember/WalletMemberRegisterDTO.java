package br.com.shiroshima.budgiebackend.dtos.walletMember;

import br.com.shiroshima.budgiebackend.models.enums.WalletRole;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record WalletMemberRegisterDTO(
    @NotBlank(message = "{email.shouldrequired}")
    @Email(message = "{email.shouldvalid}")
    String email,

    @NotNull(message = "{role.shouldrequired}")
    WalletRole role
) {}

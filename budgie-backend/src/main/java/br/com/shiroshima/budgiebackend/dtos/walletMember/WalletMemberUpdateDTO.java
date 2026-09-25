package br.com.shiroshima.budgiebackend.dtos.walletMember;

import br.com.shiroshima.budgiebackend.models.enums.WalletRole;
import jakarta.validation.constraints.NotNull;

// Só o papel muda: carteira e usuário são o que identifica o membro, trocar qualquer um dos dois é outro membro
public record WalletMemberUpdateDTO(
    @NotNull(message = "{role.shouldrequired}")
    WalletRole role
) {}

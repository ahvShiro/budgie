package br.com.shiroshima.budgiebackend.dtos.walletMember;

import java.time.LocalDateTime;

import br.com.shiroshima.budgiebackend.models.enums.WalletRole;

public record WalletMemberResponseDTO(
    Long id,
    Long walletId,
    Long userId,
    String userName,
    String userEmail,
    WalletRole role,
    LocalDateTime createdAt
) {}

package br.com.shiroshima.budgiebackend.dtos.walletMember;

import java.time.LocalDateTime;

import br.com.shiroshima.budgiebackend.models.enums.WalletRole;

// Fujo de propósito da regra de achatar relação em id: a tela de membros precisa mostrar nome e e-mail,
// e sem eles o frontend faria um GET /users/{id} por linha da lista
public record WalletMemberResponseDTO(
    Long id,
    Long walletId,
    Long userId,
    String userName,
    String userEmail,
    WalletRole role,
    LocalDateTime createdAt
) {}

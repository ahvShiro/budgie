package br.com.shiroshima.budgiebackend.dtos.category;

import br.com.shiroshima.budgiebackend.models.enums.TransactionType;

public record CategoryResponseDTO(
    Long id,
    Long walletId,
    String name,
    TransactionType transactionType,
    String color,
    String icon,
    boolean active
) {}

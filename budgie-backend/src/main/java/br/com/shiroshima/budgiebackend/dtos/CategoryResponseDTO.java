package br.com.shiroshima.budgiebackend.dtos;

import br.com.shiroshima.budgiebackend.models.enums.TransactionType;

public record CategoryResponseDTO(
    Long id,
    Long userId,
    String name,
    TransactionType transactionType,
    String color,
    String icon,
    boolean active
) {}

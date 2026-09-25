package br.com.shiroshima.budgiebackend.dtos.transaction;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import br.com.shiroshima.budgiebackend.models.enums.TransactionType;

public record TransactionResponseDTO(
    Long id,
    Long walletId,
    Long categoryId,
    Long createdById,
    TransactionType type,
    BigDecimal value,
    String description,
    LocalDate date,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    boolean active
) {}

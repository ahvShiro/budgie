package br.com.shiroshima.budgiebackend.dtos.transaction;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import br.com.shiroshima.budgiebackend.models.enums.TransactionType;

public record RecentTransactionDTO(
    Long id,
    Long walletId,
    String walletName,
    Long categoryId,
    String categoryName,
    String categoryColor,
    TransactionType type,
    BigDecimal value,
    String description,
    LocalDateTime date
) {}

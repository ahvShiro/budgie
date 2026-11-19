package br.com.shiroshima.budgiebackend.dtos.wallet;

import java.math.BigDecimal;
import java.util.List;

import br.com.shiroshima.budgiebackend.models.enums.WalletRole;

// Listagem tela front
public record WalletListingDTO(
    Long id,

    Long ownerId,

    String name,

    String description,

    List<String> members,

    BigDecimal balance,

    BigDecimal monthIncome,

    BigDecimal monthExpense,

    WalletRole role
) {}

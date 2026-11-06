package br.com.shiroshima.budgiebackend.dtos.wallet;

import java.math.BigDecimal;
import java.util.List;

// Listagem tela front
public record WalletListingDTO(
    Long id,

    String name,

    String description,

    List<String> members,

    BigDecimal balance
) {}

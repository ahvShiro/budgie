package br.com.shiroshima.budgiebackend.dtos.wallet;

import java.math.BigDecimal;

public record WalletTotalBalanceDTO(
    BigDecimal balance
) {}

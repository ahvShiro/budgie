package br.com.shiroshima.budgiebackend.repositories.projections;

import java.math.BigDecimal;

public record WalletBalance(
        Long walletId,
        BigDecimal balance,
        BigDecimal monthIncome,
        BigDecimal monthExpense
) {
    public static WalletBalance empty(Long walletId) {
        return new WalletBalance(walletId, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
    }
}

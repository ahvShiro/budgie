package br.com.shiroshima.budgiebackend.repositories.projections;

import java.math.BigDecimal;

public interface WalletBalance {
    Long getWalletId();

    BigDecimal getBalance();
}

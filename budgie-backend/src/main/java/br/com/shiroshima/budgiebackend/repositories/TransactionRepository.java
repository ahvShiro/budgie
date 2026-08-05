package br.com.shiroshima.budgiebackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.shiroshima.budgiebackend.models.Transaction;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long>{
    // walletId no finder pra ninguém ler lançamento de outra carteira chutando o id
    Optional<Transaction> findByIdAndWalletIdAndActive(Long id, Long walletId, Boolean active);

    @Modifying(flushAutomatically = true)
    @Query("UPDATE Transaction t SET t.active = false WHERE t.wallet.id = :walletId AND t.active = true")
    int deactivateByWalletId(@Param("walletId") Long walletId);
}

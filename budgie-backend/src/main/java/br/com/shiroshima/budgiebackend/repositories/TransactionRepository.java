package br.com.shiroshima.budgiebackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.shiroshima.budgiebackend.models.Transaction;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long>{
    // walletId no finder pra ninguém ler lançamento de outra carteira chutando o id
    Optional<Transaction> findByIdAndWalletIdAndActive(Long id, Long walletId, Boolean active);
}

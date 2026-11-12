package br.com.shiroshima.budgiebackend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.shiroshima.budgiebackend.models.Category;
import br.com.shiroshima.budgiebackend.models.enums.TransactionType;


public interface CategoryRepository extends JpaRepository<Category, Long>{
    List<Category> findByWalletIdAndActive(Long walletId, Boolean active);
    List<Category> findByWalletIdAndTransactionTypeAndActive(Long walletId, TransactionType transactionType, Boolean active);
    Optional<Category> findByIdAndWalletIdAndActive(Long id, Long walletId, Boolean active);

    @Modifying(flushAutomatically = true)
    @Query("UPDATE Category c SET c.active = false WHERE c.wallet.id = :walletId AND c.active = true")
    int deactivateByWalletId(@Param("walletId") Long walletId);
}

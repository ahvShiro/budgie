package br.com.shiroshima.budgiebackend.repositories;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.shiroshima.budgiebackend.models.Transaction;
import br.com.shiroshima.budgiebackend.models.enums.TransactionType;

import java.time.LocalDate;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByIdAndWalletIdAndActive(Long id, Long walletId, Boolean active);

    @EntityGraph(attributePaths = { "category", "createdBy", "wallet" })
    @Query("""
            SELECT t FROM Transaction t
            LEFT JOIN t.category c
            WHERE t.wallet.id = :walletId
              AND t.active = true
              AND (:type IS NULL OR t.type = :type)
              AND (:categoryId IS NULL OR c.id = :categoryId)
                          AND (:startDate IS NULL OR t.date >= :startDate)
                          AND (:endDate IS NULL OR t.date <= :endDate)
                        """)
    Page<Transaction> search(
            @Param("walletId") Long walletId,
            @Param("type") TransactionType type,
            @Param("categoryId") Long categoryId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);

    @Modifying(flushAutomatically = true)
    @Query("UPDATE Transaction t SET t.active = false WHERE t.wallet.id = :walletId AND t.id = :id AND t.active = true")
    int deactivateByWalletId(@Param("walletId") Long walletId, @Param("id") Long id);

    @Modifying(flushAutomatically = true)
    @Query("UPDATE Transaction t SET t.active = false WHERE t.wallet.id = :walletId AND t.id = :id AND t.active = true")
    int deactivateByWalletIdAndId(@Param("walletId") Long walletId, @Param("id") Long id);

}

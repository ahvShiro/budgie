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
import br.com.shiroshima.budgiebackend.repositories.projections.WalletBalance;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    Optional<Transaction> findByIdAndWalletIdAndActive(Long id, Long walletId, Boolean active);

    boolean existsByCategoryIdAndActive(Long categoryId, Boolean active);

    @EntityGraph(attributePaths = { "category", "createdBy", "wallet" })
    @Query("""
            SELECT t FROM Transaction t
            LEFT JOIN t.category c
            WHERE t.wallet.id = :walletId
              AND t.active = true
              AND (:type IS NULL OR t.type = :type)
              AND (:categoryId IS NULL OR c.id = :categoryId)
              AND (CAST(:startAt AS LocalDateTime) IS NULL OR t.date >= :startAt)
              AND (CAST(:endAt AS LocalDateTime) IS NULL OR t.date < :endAt)
                        """)
    Page<Transaction> search(
            @Param("walletId") Long walletId,
            @Param("type") TransactionType type,
            @Param("categoryId") Long categoryId,
            @Param("startAt") LocalDateTime startAt,
            @Param("endAt") LocalDateTime endAt,
            Pageable pageable);

    @Query("""
            SELECT new br.com.shiroshima.budgiebackend.repositories.projections.WalletBalance(
                       t.wallet.id,
                       SUM(CASE WHEN t.type = br.com.shiroshima.budgiebackend.models.enums.TransactionType.INCOME
                                THEN t.value ELSE -t.value END),
                       SUM(CASE WHEN t.type = br.com.shiroshima.budgiebackend.models.enums.TransactionType.INCOME
                                 AND t.date >= :monthStart AND t.date < :monthEnd
                                THEN t.value ELSE 0 END),
                       SUM(CASE WHEN t.type = br.com.shiroshima.budgiebackend.models.enums.TransactionType.EXPENSE
                                 AND t.date >= :monthStart AND t.date < :monthEnd
                                THEN t.value ELSE 0 END))
            FROM Transaction t
            WHERE t.wallet.id IN :walletIds
              AND t.active = true
            GROUP BY t.wallet.id
            """)
    List<WalletBalance> sumBalanceByWalletIds(
            @Param("walletIds") List<Long> walletIds,
            @Param("monthStart") LocalDateTime monthStart,
            @Param("monthEnd") LocalDateTime monthEnd);

    @EntityGraph(attributePaths = { "category", "wallet" })
    List<Transaction> findTop10ByWalletIdInAndActiveOrderByDateDescCreatedAtDesc(List<Long> walletIds, Boolean active);

    @Modifying(flushAutomatically = true)
    @Query("UPDATE Transaction t SET t.active = false WHERE t.wallet.id = :walletId AND t.active = true")
    int deactivateByWalletId(@Param("walletId") Long walletId);

    @Modifying(flushAutomatically = true)
    @Query("UPDATE Transaction t SET t.active = false WHERE t.wallet.id = :walletId AND t.id = :id AND t.active = true")
    int deactivateByWalletIdAndId(@Param("walletId") Long walletId, @Param("id") Long id);

}

package br.com.shiroshima.budgiebackend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.shiroshima.budgiebackend.models.WalletMember;

public interface WalletMemberRepository extends JpaRepository<WalletMember, Long> {
    boolean existsByWalletIdAndUserId(Long walletId, Long userId);

    Optional<WalletMember> findByWalletIdAndUserId(Long walletId, Long userId);


    @Query("SELECT m FROM WalletMember m JOIN FETCH m.user WHERE m.wallet.id = :walletId")
    List<WalletMember> findByWalletId(@Param("walletId") Long walletId);

    @Query("SELECT m FROM WalletMember m JOIN FETCH m.wallet w WHERE m.user.id = :userId AND w.active = :active")
    List<WalletMember> findByUserIdAndWalletActive(@Param("userId") Long userId, @Param("active") Boolean active);
}

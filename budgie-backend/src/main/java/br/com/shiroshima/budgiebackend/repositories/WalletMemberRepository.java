package br.com.shiroshima.budgiebackend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.shiroshima.budgiebackend.models.WalletMember;

public interface WalletMemberRepository extends JpaRepository<WalletMember, Long> {
    boolean existsByWalletIdAndUserId(Long walletId, Long userId);

    Optional<WalletMember> findByWalletIdAndUserId(Long walletId, Long userId);

    List<WalletMember> findByWalletId(Long walletId);

    // Atravessa a relação até wallet.active pra carteira soft-deletada não voltar na listagem
    List<WalletMember> findByUserIdAndWalletActive(Long userId, Boolean active);
}

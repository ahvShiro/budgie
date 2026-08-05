package br.com.shiroshima.budgiebackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.shiroshima.budgiebackend.models.Wallet;
import java.util.List;
import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet, Long>{
    Optional<Wallet> findByIdAndActive(Long id, Boolean active);

    // TODO listagem por dono enquanto WalletMember não existe
    List<Wallet> findByOwnerIdAndActive(Long ownerId, Boolean active);
}

package br.com.shiroshima.budgiebackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.shiroshima.budgiebackend.models.Wallet;
import java.util.Optional;

public interface WalletRepository extends JpaRepository<Wallet, Long>{
    Optional<Wallet> findByIdAndActive(Long id, Boolean active);
}

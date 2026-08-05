package br.com.shiroshima.budgiebackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import br.com.shiroshima.budgiebackend.models.Wallet;

public interface WalletRepository extends JpaRepository<Wallet, Long>{}

package br.com.shiroshima.budgiebackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.shiroshima.budgiebackend.models.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long>{
}

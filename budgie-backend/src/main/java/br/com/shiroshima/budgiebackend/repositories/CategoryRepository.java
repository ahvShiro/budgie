package br.com.shiroshima.budgiebackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.shiroshima.budgiebackend.models.Category;
import java.util.List;
import java.util.Optional;

import br.com.shiroshima.budgiebackend.models.enums.TransactionType;


public interface CategoryRepository extends JpaRepository<Category, Long>{
    List<Category> findByTransactionTypeAndActive(TransactionType transactionType, Boolean active);
    List<Category> findAllByActive(Boolean active);
    Optional<Category> findByIdAndActive(Long id, Boolean active);
}

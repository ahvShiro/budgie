package br.com.shiroshima.budgiebackend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.shiroshima.budgiebackend.models.Category;

public interface CategoryRepository extends JpaRepository<Category, Long>{
    
}

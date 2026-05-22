package br.com.shiroshima.budgiebackend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.shiroshima.budgiebackend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    
}

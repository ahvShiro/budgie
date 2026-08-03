package br.com.shiroshima.budgiebackend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.com.shiroshima.budgiebackend.models.PasswordRedefinitionToken;
import br.com.shiroshima.budgiebackend.models.User;

public interface PasswordRedefinitionTokenRepository extends JpaRepository<PasswordRedefinitionToken, Long>{
    @Query("SELECT t FROM PasswordRedefinitionToken t WHERE t.user = :user ORDER BY t.expiresAt DESC")
    List<PasswordRedefinitionToken> findTokensByUser(@Param("user") User user);
}

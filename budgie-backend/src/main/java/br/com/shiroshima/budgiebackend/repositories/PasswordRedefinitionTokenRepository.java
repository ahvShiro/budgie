package br.com.shiroshima.budgiebackend.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.shiroshima.budgiebackend.models.PasswordRedefinitionToken;
import br.com.shiroshima.budgiebackend.models.User;

public interface PasswordRedefinitionTokenRepository extends JpaRepository<PasswordRedefinitionToken, Long>{
    Optional<PasswordRedefinitionToken> findByToken(String token);

    List<PasswordRedefinitionToken> findByUserAndWasAlreadyUsedFalse(User user);
}

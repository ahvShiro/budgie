package br.com.shiroshima.budgiebackend.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import br.com.shiroshima.budgiebackend.exceptions.InvalidTokenException;
import br.com.shiroshima.budgiebackend.models.PasswordRedefinitionToken;
import br.com.shiroshima.budgiebackend.models.User;
import br.com.shiroshima.budgiebackend.repositories.PasswordRedefinitionTokenRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PasswordRedefinitionTokenService {

    private final PasswordRedefinitionTokenRepository repo;

    // Métodos internos

    public PasswordRedefinitionToken fetchByToken(String token) {
        return repo.findByToken(token)
            .orElseThrow(() -> new InvalidTokenException("Token de redefinição inválido"));
    }

    // Só um link ativo por usuário. se pedir um movo capa os anteriores
    public PasswordRedefinitionToken generateToken(User user) {
        invalidateUserTokens(user);

        return repo.save(new PasswordRedefinitionToken(
            user,
            UUID.randomUUID().toString(),
            LocalDateTime.now().plusHours(1)
        ));
    }

    public void invalidateUserTokens(User user) {
        List<PasswordRedefinitionToken> tokens = repo.findByUserAndWasAlreadyUsedFalse(user);
        tokens.forEach(token -> token.setWasAlreadyUsed(true));
        repo.saveAll(tokens);
    }

    public void invalidateToken(PasswordRedefinitionToken token) {
        token.setWasAlreadyUsed(true);
        repo.save(token);
    }
}

package br.com.shiroshima.budgiebackend.services;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import br.com.shiroshima.budgiebackend.dtos.passwordRecover.EmailDTO;
import br.com.shiroshima.budgiebackend.dtos.passwordRecover.PasswordTokenDTO;
import br.com.shiroshima.budgiebackend.exceptions.BusinessException;
import br.com.shiroshima.budgiebackend.exceptions.InvalidTokenException;
import br.com.shiroshima.budgiebackend.models.PasswordRedefinitionToken;
import br.com.shiroshima.budgiebackend.models.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@Validated
@RequiredArgsConstructor
public class AuthService {

    private final EmailService emailService;
    private final UserService userService;
    private final PasswordRedefinitionTokenService tokenService;

    @Value("${passwordrecovery}")
    private String recoveryUrl;

    public void passwordRecovery(@Valid EmailDTO data) {
        Optional<User> user = userService.fetchByEmail(data.email());
        if (user.isEmpty()) return;

        PasswordRedefinitionToken token = tokenService.generateToken(user.get());

        String url = recoveryUrl + "/" + token.getToken();

        emailService.sendPasswordRecoveryURLEmail(user.get().getEmail(), user.get().getName(), url);
    }


    public void resetPassword(@Valid PasswordTokenDTO data) {
        PasswordRedefinitionToken token = tokenService.fetchByToken(data.token());

        if (!token.isValid()) {
            throw new InvalidTokenException("Token de redefinição expirado ou já utilizado");
        }

        if (!data.newPassword().equals(data.newPasswordConfirmation())) {
            throw new BusinessException("Senha não corresponde com a confirmação");
        }

        userService.updatePassword(token.getUser(), data.newPassword());
        tokenService.invalidateToken(token);
    }

}

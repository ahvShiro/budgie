package br.com.shiroshima.budgiebackend.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.shiroshima.budgiebackend.dtos.AuthDTO;
import br.com.shiroshima.budgiebackend.dtos.AuthResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.EmailDTO;
import br.com.shiroshima.budgiebackend.dtos.MessageDTO;
import br.com.shiroshima.budgiebackend.dtos.PasswordTokenDTO;
import br.com.shiroshima.budgiebackend.dtos.UserRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.UserResponseDTO;
import br.com.shiroshima.budgiebackend.models.User;
import br.com.shiroshima.budgiebackend.services.AuthService;
import br.com.shiroshima.budgiebackend.services.TokenService;
import br.com.shiroshima.budgiebackend.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    private final AuthenticationManager authManager;
    private final TokenService tokenService;
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody @Valid AuthDTO authDTO) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(authDTO.email(), authDTO.password());
        var auth = this.authManager.authenticate(usernamePassword);

        User user = (User) auth.getPrincipal();
        var token = tokenService.generateToken(user);
        
        return ResponseEntity.ok(new AuthResponseDTO(token));
    }

    @CrossOrigin
    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody @Valid UserRegisterDTO data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.registerUser(data));
    }

    /*
    POST /auth/forgot-password
    Request body: { "email": "joao@email.com" }
    Response 200 OK: Sempre retorna a mesma mensagem neutra, independente de o e-mail existir:
    { "message": "Se este e-mail estiver cadastrado, você receberá as instruções em breve." }

    */
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageDTO> forgotPassword(@RequestBody EmailDTO data) {
        authService.passwordRecovery(data);
        return ResponseEntity.ok(new MessageDTO("Se este e-mail estiver cadastrado, você receberá as instruções em breve."));
    }

    /* 
    POST /auth/reset-password
    Request body:
    { "token": "abc123", "newPassword": "NovaSenha@456" }
    Response 200 OK: { "message": "Senha redefinida com sucesso." }
    Erros: 400 se token inválido, expirado ou já utilizado.
    */
    @PostMapping("/reset-password")
    public ResponseEntity<MessageDTO> resetPassword(@RequestBody PasswordTokenDTO data) {
        authService.resetPassword(data);
        return ResponseEntity.ok(null);
    }
}

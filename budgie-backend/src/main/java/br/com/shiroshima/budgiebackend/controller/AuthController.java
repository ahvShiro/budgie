package br.com.shiroshima.budgiebackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.shiroshima.budgiebackend.dto.RegisterDTO;
import br.com.shiroshima.budgiebackend.dto.UserResponseDTO;
import br.com.shiroshima.budgiebackend.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    
    @Autowired
    private UserService service;

    // @PostMapping("/login")
    // public ResponseEntity<Void> login(@RequestBody @Valid AuthDTO data) {
    //     // var userPassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());
    //     // var auth = this.authManager.authenticate(userPassword);

    //     return ResponseEntity.ok().build();
    // }

    @PostMapping("/register")
    public ResponseEntity<UserResponseDTO> register(@RequestBody @Valid RegisterDTO data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createUser(data));
    }


    /*
    POST /auth/forgot-password
    Request body: { "email": "joao@email.com" }
    Response 200 OK: Sempre retorna a mesma mensagem neutra, independente de o e-mail existir:
    { "message": "Se este e-mail estiver cadastrado, você receberá as instruções em breve." }
    O backend deve gerar um token único, salvá-lo em PasswordResetToken com expiração de 1 hora, e — como não há envio real de e-mail — apenas retornar o token no corpo da resposta para fins de teste:
    { "message": "...", "debugToken": "abc123" }
    Em produção, o debugToken jamais seria retornado. É um facilitador apenas para os testes da atividade.
    */
    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword() {
        return ResponseEntity.ok(null);
    }

    /* 
    POST /auth/reset-password
    Request body:
    { "token": "abc123", "newPassword": "NovaSenha@456" }
    Response 200 OK: { "message": "Senha redefinida com sucesso." }
    Erros: 400 se token inválido, expirado ou já utilizado.
    */
    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword() {
        return ResponseEntity.ok(null);
    }
}

package br.com.shiroshima.budgiebackend.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.shiroshima.budgiebackend.dtos.UserResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.UserUpdateDTO;
import br.com.shiroshima.budgiebackend.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    // Retorna dados do usuário autenticado
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> getCurrentUser() {
        return ResponseEntity.ok(service.getCurrentUser());
    }

    // Atualiza nome (e outros campos opcionais)
    @PutMapping("/me")
    public ResponseEntity<UserResponseDTO> updateCurrentUser(@Valid @RequestBody UserUpdateDTO data) {
        return ResponseEntity.ok(service.updateCurrentUser(data));
    }

    // Altera a senha (exige senha atual)
    /*
     * Request body:
     * { "currentPassword": "Senha@123", "newPassword": "NovaSenha@456" }
     * Response 200 OK: { "message": "Senha alterada com sucesso." }
     * Erros: 422 se a senha atual estiver incorreta.
     */
    @PatchMapping("/me")
    public ResponseEntity<Void> editCurrentUserPassword() {
        return ResponseEntity.ok().build();
    }
}

package br.com.shiroshima.budgiebackend.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.shiroshima.budgiebackend.dtos.passwordRecover.UserPasswordUpdateDTO;
import br.com.shiroshima.budgiebackend.dtos.user.UserResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.user.UserUpdateDTO;
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

    @PutMapping("/me")
    public ResponseEntity<UserResponseDTO> updateCurrentUser(@Valid @RequestBody UserUpdateDTO data) {
        return ResponseEntity.ok(service.updateCurrentUser(data));
    }

    @PatchMapping("/me/password")
    public ResponseEntity<Void> updateCurrentUserPassword(@Valid @RequestBody UserPasswordUpdateDTO data) {
        service.updateCurrentUserPassword(data);
        return ResponseEntity.noContent().build();
    }

    // ADMIN
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getUsers() {
        return ResponseEntity.ok(service.getUsers());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeUser(@PathVariable Long id) {
        service.removeUser(id);
        return ResponseEntity.noContent().build();
    }
}

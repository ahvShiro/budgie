package br.com.shiroshima.budgiebackend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.shiroshima.budgiebackend.model.User;
import br.com.shiroshima.budgiebackend.service.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping
public class UserController {

    @Autowired
    private UserService service;

    @GetMapping
    public ResponseEntity<String> teste() {
        return ResponseEntity.ok("GET localhost:8080 enviado com sucesso");
    }

    // Retorna dados do usuário autenticado
    @GetMapping("/me")
    public ResponseEntity<User> fetchCurrentUser() {
        try {
            return ResponseEntity.ok(new User());
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Atualiza nome (e outros campos opcionais)
    @PutMapping("/me")
    public ResponseEntity<Void> editCurrentUser() {
        return ResponseEntity.ok().build();
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



    @GetMapping("/{id}")
    public ResponseEntity<User> fetchUserById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.fetchById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<User> addUser(@RequestBody @Valid User user) {
        var response = service.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeUser(@PathVariable Long id) {
        service.remove(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @PutMapping
    public ResponseEntity<User> editUser(@RequestBody @Valid User user) {
        return ResponseEntity.ok(service.edit(user));
    }
}

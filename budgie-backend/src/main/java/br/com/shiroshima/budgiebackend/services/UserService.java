package br.com.shiroshima.budgiebackend.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.shiroshima.budgiebackend.dtos.UserRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.UserResponseDTO;
import br.com.shiroshima.budgiebackend.exceptions.BusinessException;
import br.com.shiroshima.budgiebackend.models.User;
import br.com.shiroshima.budgiebackend.models.enums.AuthRole;
import br.com.shiroshima.budgiebackend.repositories.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.validation.annotation.Validated;
import org.thymeleaf.context.Context;

@Service
@Validated
@RequiredArgsConstructor
public class UserService {

    private final EmailService emailService;
    private final UserRepository repo;

    public UserResponseDTO createUser(@Valid UserRegisterDTO data) {
        if (repo.findByEmail(data.email()) != null) {
            throw new BusinessException("Usuário já existe");
        }

        if (!data.password().equals(data.passwordConfirmation())) {
            throw new BusinessException("Senha não corresponde com a confirmação");
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());

        User user = new User(data.name(), data.email(), encryptedPassword, AuthRole.USER);
        User responseUser = repo.save(user);

        // emailService.sendEmail(user.getEmail(), "Success", "You got mail!!!");

        Context context = new Context();
        context.setVariable("name", user.getName());
        emailService.sendEmailTemplate(user.getEmail(), "Novo Cadastro - Budgie", "novoCadastro", context);

        return new UserResponseDTO(
            responseUser.getId(), 
            responseUser.getName(), 
            responseUser.getEmail(),
            responseUser.getCreatedAt()        
        );
    }

    public List<User> listAll() {
        return repo.findAll();
    }

    public User fetchById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Id not found")); // TODO COLOCAR EXCECAO CORRESPONDENTE
    }

    public void remove(Long id) {
        repo.deleteById(id);
    }

    public User edit(User user) {
        User prevUser = fetchById(user.getId());
        prevUser.setName(user.getName());

        return repo.save(prevUser);
    }

    public User getAuthenticatedUser() {
        var context = SecurityContextHolder.getContext();
        var authentication = context.getAuthentication();
        User currentUser = (User) authentication.getPrincipal();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Usuário não autenticado");
        } 

        return currentUser;
    }
}

package br.com.shiroshima.budgiebackend.services;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.shiroshima.budgiebackend.dtos.UserPasswordUpdateDTO;
import br.com.shiroshima.budgiebackend.dtos.UserRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.UserResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.UserUpdateDTO;
import br.com.shiroshima.budgiebackend.exceptions.BusinessException;
import br.com.shiroshima.budgiebackend.exceptions.ResourceNotFoundException;
import br.com.shiroshima.budgiebackend.mappers.UserMapper;
import br.com.shiroshima.budgiebackend.models.User;
import br.com.shiroshima.budgiebackend.repositories.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.validation.annotation.Validated;

@Service
@Validated
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repo;
    private final UserMapper mapper;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    public List<User> fetchUsers() {
        return repo.findAll();
    }

    public User fetchById(Long id) {
        return repo.findById(id).orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
    }

    public Optional<User> fetchByEmail(String email) {
        return repo.findByEmail(email);
    }

    public User fetchAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new BusinessException("Usuário não autenticado");
        }

        return (User) authentication.getPrincipal();
    }

    public void deleteUser(User user) {
        repo.delete(user);
    }

    // Métodos externos

    public UserResponseDTO registerUser(@Valid UserRegisterDTO data) {
        if (repo.findByEmail(data.email()).isPresent()) {
            throw new BusinessException("Usuário já existe");
        }

        if (!data.password().equals(data.passwordConfirmation())) {
            throw new BusinessException("Senha não corresponde com a confirmação");
        }

        User newUser = mapper.toEntity(data, passwordEncoder.encode(data.password()));
        repo.save(newUser);

        emailService.sendNewSigninEmail(newUser.getEmail(), newUser.getName());

        return mapper.toResponse(newUser);
    }

    public List<UserResponseDTO> getUsers() {
        return fetchUsers()
        .stream()
        .map(obj -> mapper.toResponse(obj))
        .toList();
    }

    public UserResponseDTO getCurrentUser() {
        return mapper.toResponse(fetchAuthenticatedUser());
    }

    public UserResponseDTO updateCurrentUser(@Valid UserUpdateDTO data) {
        User current = fetchAuthenticatedUser();

        mapper.updateEntity(current, data);
        repo.save(current);
        return mapper.toResponse(current);
    }

    public void updateCurrentUserPassword(@Valid UserPasswordUpdateDTO data) {
        User current = fetchAuthenticatedUser();

        if (!passwordEncoder.matches(data.currentPassword(), current.getPassword())) {
            throw new BusinessException("Senha atual incorreta");
        }

        if (!data.newPassword().equals(data.newPasswordConfirmation())) {
            throw new BusinessException("Senha não corresponde com a confirmação");
        }

        current.setPassword(passwordEncoder.encode(data.newPassword()));
        repo.save(current);
    }

    public void removeUser(Long id) {
        deleteUser(fetchById(id));
    }

}

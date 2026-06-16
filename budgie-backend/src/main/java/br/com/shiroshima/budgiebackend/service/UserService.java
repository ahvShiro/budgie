package br.com.shiroshima.budgiebackend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import br.com.shiroshima.budgiebackend.dto.RegisterDTO;
import br.com.shiroshima.budgiebackend.dto.UserResponseDTO;
import br.com.shiroshima.budgiebackend.exception.BusinessException;
import br.com.shiroshima.budgiebackend.model.User;
import br.com.shiroshima.budgiebackend.model.enums.AuthRole;
import br.com.shiroshima.budgiebackend.repository.UserRepository;
import jakarta.validation.Valid;

@Service
public class UserService {

    @Autowired
    private UserRepository repo;

    public UserResponseDTO createUser(@Valid RegisterDTO data) {
        if (repo.findByEmail(data.getEmail()) != null) {
            throw new BusinessException("Usuário já existe");
        }

        if (!data.getPassword().equals(data.getPasswordConfirmation())) {
            throw new BusinessException("Senha não corresponde com a confirmação");
        }

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.getPassword());

        User user = new User(data.getName(), data.getEmail(), encryptedPassword, AuthRole.USER);
        User responseUser = repo.save(user);

        return new UserResponseDTO(
            responseUser.getId(), 
            responseUser.getName(), 
            responseUser.getEmail(),
            responseUser.getCreatedAt(), 
            responseUser.getPassword()
        );
    }

    public List<User> listAll() {
        return repo.findAll();
    }

    public User fetchById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Id not found"));
    }

    public void remove(Long id) {
        repo.deleteById(id);
    }

    public User edit(User user) {
        User prevUser = fetchById(user.getId());
        prevUser.setName(user.getName());

        return repo.save(prevUser);
    }
}

package br.com.shiroshima.budgiebackend.mappers;

import org.springframework.stereotype.Component;

import br.com.shiroshima.budgiebackend.dtos.user.UserRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.user.UserResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.user.UserUpdateDTO;
import br.com.shiroshima.budgiebackend.models.User;
import br.com.shiroshima.budgiebackend.models.enums.AuthRole;

@Component
public class UserMapper {

    public User toEntity(UserRegisterDTO dto, String encryptedPassword) {
        return new User(
            dto.name(),
            dto.email(),
            encryptedPassword,
            AuthRole.USER
        );
    }

    public UserResponseDTO toResponse(User user) {
        return new UserResponseDTO(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getCreatedAt()
        );
    }

    public void updateEntity(User user, UserUpdateDTO dto) {
        user.setName(dto.name());
    }

}

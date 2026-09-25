package br.com.shiroshima.budgiebackend.dtos.user;

import java.time.LocalDateTime;

public record UserResponseDTO(Long id, String name, String email, LocalDateTime createdAt) {}

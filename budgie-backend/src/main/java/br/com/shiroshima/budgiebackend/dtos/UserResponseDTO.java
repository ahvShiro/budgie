package br.com.shiroshima.budgiebackend.dtos;

import java.time.LocalDateTime;

public record UserResponseDTO(Long id, String name, String email, LocalDateTime createdAt) {}

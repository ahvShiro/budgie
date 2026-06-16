package br.com.shiroshima.budgiebackend.dto;

import java.time.LocalDateTime;

public record UserResponseDTO(Long id, String name, String email, LocalDateTime createdAt) {}

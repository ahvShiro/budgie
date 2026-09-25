package br.com.shiroshima.budgiebackend.dtos.wallet;

import java.time.LocalDateTime;

public record WalletResponseDTO(
    Long id,
    Long ownerId,
    String name,
    String description,
    LocalDateTime createdAt,
    LocalDateTime updatedAt,
    boolean active
) {}

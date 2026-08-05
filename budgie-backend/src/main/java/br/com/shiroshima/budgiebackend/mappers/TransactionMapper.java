package br.com.shiroshima.budgiebackend.mappers;

import org.springframework.stereotype.Component;

import br.com.shiroshima.budgiebackend.dtos.transaction.TransactionResponseDTO;
import br.com.shiroshima.budgiebackend.models.Transaction;

@Component
public class TransactionMapper {

    // toEntity e updateEntity entram junto com o register e o update

    public TransactionResponseDTO toResponse(Transaction transaction) {
        return new TransactionResponseDTO(
            transaction.getId(),
            transaction.getWallet().getId(),
            // Categoria é opcional, então o id pode não existir
            transaction.getCategory() != null ? transaction.getCategory().getId() : null,
            transaction.getCreatedBy().getId(),
            transaction.getType(),
            transaction.getValue(),
            transaction.getDescription(),
            transaction.getDate(),
            transaction.getCreatedAt(),
            transaction.getUpdatedAt(),
            transaction.isActive()
        );
    }

}

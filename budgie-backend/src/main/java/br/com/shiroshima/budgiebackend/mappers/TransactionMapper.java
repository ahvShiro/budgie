package br.com.shiroshima.budgiebackend.mappers;

import org.springframework.stereotype.Component;

import br.com.shiroshima.budgiebackend.dtos.transaction.RecentTransactionDTO;
import br.com.shiroshima.budgiebackend.dtos.transaction.TransactionRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.transaction.TransactionResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.transaction.TransactionUpdateDTO;
import br.com.shiroshima.budgiebackend.models.Category;
import br.com.shiroshima.budgiebackend.models.Transaction;
import br.com.shiroshima.budgiebackend.models.User;
import br.com.shiroshima.budgiebackend.models.Wallet;

@Component
public class TransactionMapper {

    public Transaction toEntity(TransactionRegisterDTO dto, Wallet wallet, Category category, User createdBy) {
        return new Transaction(
            wallet,
            category,
            createdBy,
            dto.type(),
            dto.value(),
            dto.description(),
            dto.date()
        );
    }

    public TransactionResponseDTO toResponse(Transaction transaction) {
        return new TransactionResponseDTO(
            transaction.getId(),
            transaction.getWallet().getId(),
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

    public RecentTransactionDTO toRecent(Transaction transaction) {
        Category category = transaction.getCategory();
        return new RecentTransactionDTO(
            transaction.getId(),
            transaction.getWallet().getId(),
            transaction.getWallet().getName(),
            category != null ? category.getId() : null,
            category != null ? category.getName() : null,
            category != null ? category.getColor() : null,
            transaction.getType(),
            transaction.getValue(),
            transaction.getDescription(),
            transaction.getDate()
        );
    }

    public void updateEntity(Transaction transaction, TransactionUpdateDTO dto, Category category) {
        transaction.setCategory(category);
        transaction.setType(dto.type());
        transaction.setValue(dto.value());
        transaction.setDescription(dto.description());
        transaction.setDate(dto.date());
    }
}

package br.com.shiroshima.budgiebackend.services;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import br.com.shiroshima.budgiebackend.dtos.transaction.TransactionRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.transaction.TransactionResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.transaction.TransactionUpdateDTO;
import br.com.shiroshima.budgiebackend.exceptions.ResourceNotFoundException;
import br.com.shiroshima.budgiebackend.mappers.TransactionMapper;
import br.com.shiroshima.budgiebackend.models.Transaction;
import br.com.shiroshima.budgiebackend.models.enums.TransactionType;
import br.com.shiroshima.budgiebackend.repositories.TransactionRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@Validated
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository repo;
    private final TransactionMapper mapper;

    // Métodos internos

    public Transaction fetchById(Long walletId, Long id) {
        return repo.findByIdAndWalletIdAndActive(id, walletId, true)
            .orElseThrow(() -> new ResourceNotFoundException("Transação não encontrada"));
    }

    // Métodos externos

    public TransactionResponseDTO registerTransaction(Long walletId, @Valid TransactionRegisterDTO data) {
        // Precisa validar que o usuário autenticado é OWNER ou EDITOR da carteira
        return null;
    }

    public Page<TransactionResponseDTO> getTransactions(Long walletId, TransactionType type, Long categoryId, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        // Precisa validar que o usuário autenticado é membro da carteira
        return Page.empty(pageable);
    }

    public TransactionResponseDTO getTransaction(Long walletId, Long id) {
        // Precisa validar que o usuário autenticado é membro da carteira
        return mapper.toResponse(fetchById(walletId, id));
    }

    public TransactionResponseDTO updateTransaction(Long walletId, Long id, @Valid TransactionUpdateDTO data) {
        // Só OWNER ou EDITOR
        return null;
    }

    public void removeTransaction(Long walletId, Long id) {
        // Só OWNER ou EDITOR
    }

}

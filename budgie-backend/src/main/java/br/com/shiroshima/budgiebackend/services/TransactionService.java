package br.com.shiroshima.budgiebackend.services;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import br.com.shiroshima.budgiebackend.dtos.transaction.TransactionRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.transaction.TransactionResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.transaction.TransactionUpdateDTO;
import br.com.shiroshima.budgiebackend.exceptions.BusinessException;
import br.com.shiroshima.budgiebackend.exceptions.ResourceNotFoundException;
import br.com.shiroshima.budgiebackend.mappers.TransactionMapper;
import br.com.shiroshima.budgiebackend.models.Category;
import br.com.shiroshima.budgiebackend.models.Transaction;
import br.com.shiroshima.budgiebackend.models.Wallet;
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
    private final WalletService walletService;
    private final CategoryService categoryService;
    private final UserService userService;


    // Métodos internos

    public Transaction fetchById(Long walletId, Long id) {
        return repo.findByIdAndWalletIdAndActive(id, walletId, true)
            .orElseThrow(() -> new ResourceNotFoundException("Transação não encontrada"));
    }

    private Category getCategoryEvenIfNull(Long walletId, Long categoryId, TransactionType type) {
        if (categoryId == null) return null;

        Category category = categoryService.fetchById(walletId, categoryId);
        if (category.getTransactionType() != type) {
            throw new BusinessException("A categoria não corresponde ao tipo da transação");
        }
        return category;
    }

    private Category keepOrFetchCategory(Transaction t, Long walletId, Long categoryId, TransactionType type) {
        Category current = t.getCategory();
        if (current != null && current.getId().equals(categoryId) && current.getTransactionType() == type) {
            return current;
        }
        return getCategoryEvenIfNull(walletId, categoryId, type);
    }

    private Wallet fetchAccessibleWallet(Long walletId) {
        Wallet wallet = walletService.fetchById(walletId);
        walletService.checkAccess(wallet);
        return wallet;
    }

    private Wallet fetchOwnedWallet(Long walletId) {
        Wallet wallet = walletService.fetchById(walletId);
        walletService.checkOwner(wallet);
        return wallet;
    }


    // Métodos externos

    public TransactionResponseDTO registerTransaction(Long walletId, @Valid TransactionRegisterDTO data) {
        Wallet wallet = fetchAccessibleWallet(walletId);

        Transaction transaction = mapper.toEntity(
            data, 
            wallet,
            getCategoryEvenIfNull(walletId, data.categoryId(), data.type()), 
            userService.fetchAuthenticatedUser()
        );
    
        return mapper.toResponse(repo.save(transaction));
    }

    public Page<TransactionResponseDTO> getTransactions(Long walletId, TransactionType type, Long categoryId, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        fetchAccessibleWallet(walletId);

        LocalDateTime startAt = startDate != null ? startDate.atStartOfDay() : null;
        LocalDateTime endAt = endDate != null ? endDate.plusDays(1).atStartOfDay() : null;

        return repo.search(walletId, type, categoryId, startAt, endAt, pageable).map(mapper::toResponse);
    }

    public TransactionResponseDTO getTransaction(Long walletId, Long id) {
        fetchAccessibleWallet(walletId);
        return mapper.toResponse(fetchById(walletId, id));
    }

    public TransactionResponseDTO updateTransaction(Long walletId, Long id, @Valid TransactionUpdateDTO data) {
        fetchOwnedWallet(walletId);

        Transaction t = fetchById(walletId, id);
        mapper.updateEntity(t, data, keepOrFetchCategory(t, walletId, data.categoryId(), data.type()));
        
        return mapper.toResponse(repo.save(t));
    }

    public void removeTransaction(Long walletId, Long id) {
        fetchOwnedWallet(walletId);
        if (repo.deactivateByWalletIdAndId(walletId, id) == 0) {
            throw new ResourceNotFoundException("Transação não encontrada");
        }
    }

}

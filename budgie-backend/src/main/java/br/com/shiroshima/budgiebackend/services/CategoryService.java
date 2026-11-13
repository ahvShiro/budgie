package br.com.shiroshima.budgiebackend.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import br.com.shiroshima.budgiebackend.dtos.category.CategoryRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.category.CategoryResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.category.CategoryUpdateDTO;
import br.com.shiroshima.budgiebackend.exceptions.BusinessException;
import br.com.shiroshima.budgiebackend.exceptions.ResourceNotFoundException;
import br.com.shiroshima.budgiebackend.mappers.CategoryMapper;
import br.com.shiroshima.budgiebackend.models.Category;
import br.com.shiroshima.budgiebackend.models.Wallet;
import br.com.shiroshima.budgiebackend.models.enums.TransactionType;
import br.com.shiroshima.budgiebackend.repositories.CategoryRepository;
import br.com.shiroshima.budgiebackend.repositories.TransactionRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@Validated
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repo;
    private final CategoryMapper mapper;
    private final WalletService walletService;
    private final TransactionRepository transactionRepo;

    // Métodos internos

    public List<Category> fetchCategories(Long walletId, TransactionType type) {
        if (type == null) return repo.findByWalletIdAndActive(walletId, true);
        return repo.findByWalletIdAndTransactionTypeAndActive(walletId, type, true);
    }

    public Category fetchById(Long walletId, Long id) {
        return repo.findByIdAndWalletIdAndActive(id, walletId, true)
            .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
    }

    public void deactivateCategory(Category category) {
        category.setActive(false);
        repo.save(category);
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

    public CategoryResponseDTO registerCategory(Long walletId, @Valid CategoryRegisterDTO data) {
        Category newCategory = mapper.toEntity(data, fetchAccessibleWallet(walletId));
        repo.save(newCategory);
        return mapper.toResponse(newCategory);
    }

    public List<CategoryResponseDTO> getCategories(Long walletId, TransactionType type) {
        fetchAccessibleWallet(walletId);

        return fetchCategories(walletId, type)
        .stream()
        .map(obj -> mapper.toResponse(obj))
        .toList();
    }

    public CategoryResponseDTO updateCategory(Long walletId, Long id, @Valid CategoryUpdateDTO data) {
        fetchAccessibleWallet(walletId);
        Category old = fetchById(walletId, id);

        if (old.getTransactionType() != data.transactionType() && transactionRepo.existsByCategoryIdAndActive(old.getId(), true)) {
            throw new BusinessException("Não é possível mudar o tipo de uma categoria que já possui transações");
        }

        mapper.updateEntity(old, data);
        repo.save(old);
        return mapper.toResponse(old);
    }

    public void removeCategory(Long walletId, Long id) {
        fetchOwnedWallet(walletId);
        Category cat = fetchById(walletId, id);

        deactivateCategory(cat);
    }

}

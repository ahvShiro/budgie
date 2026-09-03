package br.com.shiroshima.budgiebackend.services;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import br.com.shiroshima.budgiebackend.dtos.category.CategoryRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.category.CategoryResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.category.CategoryUpdateDTO;
import br.com.shiroshima.budgiebackend.exceptions.BusinessException;
import br.com.shiroshima.budgiebackend.exceptions.ResourceNotFoundException;
import br.com.shiroshima.budgiebackend.mappers.CategoryMapper;
import br.com.shiroshima.budgiebackend.models.Category;
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
    private final UserService userService;
    private final TransactionRepository transactionRepo;

    // Métodos internos

    public List<Category> fetchCategories(TransactionType type) {
        if (type == null) return repo.findAll();
        return repo.findByTransactionTypeAndActive(type, true);
    } 

    public Category fetchById(Long id) {
        return repo.findByIdAndActive(id, true).orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada"));
    }

    public void deleteCategory(Category category) {
        repo.delete(category);
    }

    public void checkOwner(Category category) {
        if (!category.getUser().getId().equals(userService.fetchAuthenticatedUser().getId())) {
            throw new AccessDeniedException("Você não tem acesso a esta categoria");
        }
    }

    // Métodos externos

    public CategoryResponseDTO registerCategory(@Valid CategoryRegisterDTO data) {
        Category newCategory = mapper.toEntity(data, userService.fetchById(data.userId()));
        repo.save(newCategory);
        return mapper.toResponse(newCategory);
    }

    public List<CategoryResponseDTO> getCategories(TransactionType type) {
        // Filtrar por categorias do usuário
        return fetchCategories(type)
        .stream()
        .map(obj -> mapper.toResponse(obj))
        .toList();
    }

    public CategoryResponseDTO updateCategory(Long id, @Valid CategoryUpdateDTO data) {
        Category old = fetchById(id);
        checkOwner(old);

        mapper.updateEntity(old, data);
        repo.save(old);
        return mapper.toResponse(old);
    }

    public void removeCategory(Long id) {
        Category cat = fetchById(id);

        if (transactionRepo.existsByCategoryIdAndActive(cat.getId(), true)) {
            throw new BusinessException("Não foi possível excluir pois existem transações com esta categoria");
        }

        deleteCategory(cat);
    }

}

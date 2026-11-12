package br.com.shiroshima.budgiebackend.mappers;

import org.springframework.stereotype.Component;

import br.com.shiroshima.budgiebackend.dtos.category.CategoryRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.category.CategoryResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.category.CategoryUpdateDTO;
import br.com.shiroshima.budgiebackend.models.Category;
import br.com.shiroshima.budgiebackend.models.Wallet;

@Component
public class CategoryMapper {

    public Category toEntity(CategoryRegisterDTO dto, Wallet wallet) {
        return new Category(
            wallet,
            dto.name(),
            dto.transactionType(),
            dto.color(),
            dto.icon()
        );
    }

    public CategoryResponseDTO toResponse(Category category) {
        return new CategoryResponseDTO(
            category.getId(),
            category.getWallet().getId(),
            category.getName(),
            category.getTransactionType(),
            category.getColor(),
            category.getIcon(),
            category.isActive()
        );
    }

    public void updateEntity(Category category, CategoryUpdateDTO dto) {
        category.setName(dto.name());
        category.setTransactionType(dto.transactionType());
        category.setColor(dto.color());
        category.setIcon(dto.icon());
        category.setActive(dto.active());
    }

}

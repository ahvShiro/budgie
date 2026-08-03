package br.com.shiroshima.budgiebackend.mappers;

import org.springframework.stereotype.Component;

import br.com.shiroshima.budgiebackend.dtos.CategoryRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.CategoryResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.CategoryUpdateDTO;
import br.com.shiroshima.budgiebackend.models.Category;
import br.com.shiroshima.budgiebackend.models.User;

@Component
public class CategoryMapper {

    public Category toEntity(CategoryRegisterDTO dto, User owner) {
        return new Category(
            owner,
            dto.name(),
            dto.transactionType(),
            dto.color(),
            dto.icon()
        );
    }

    public CategoryResponseDTO toResponse(Category category) {
        return new CategoryResponseDTO(
            category.getId(),
            category.getUser().getId(),
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

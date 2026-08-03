package br.com.shiroshima.budgiebackend.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import br.com.shiroshima.budgiebackend.dtos.CategoryRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.CategoryResponseDTO;
import br.com.shiroshima.budgiebackend.mappers.CategoryMapper;
import br.com.shiroshima.budgiebackend.models.Category;
import br.com.shiroshima.budgiebackend.models.enums.TransactionType;
import br.com.shiroshima.budgiebackend.repositories.CategoryRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@Validated
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository repo;
    private final CategoryMapper mapper;
    private final UserService userService;

    public CategoryResponseDTO registerCategory(@Valid CategoryRegisterDTO data) {
        Category newCategory = mapper.toEntity(data, userService.fetchById(data.userId()));
        repo.save(newCategory);
        return mapper.toResponse(newCategory);
    }

    /*
ERRO: Não acho legal estourar esse erro pro usuário em uma mensagem de erro, então daria pra colocar um erro generico
{
	"userId": 20,
	"name": "Salário",
	"transactionType": "INCOME",
	"color": "FFFFFF",
	"icon": "https://picsum.photos/50/50"
}

{
    "status": 409,
    "message": "could not execute statement [Field 'title' doesn't have a default value] [insert into categories (color,icon,is_active,name,transaction_type,user_id) values (?,?,?,?,?,?)]; SQL [insert into categories (color,icon,is_active,name,transaction_type,user_id) values (?,?,?,?,?,?)]; constraint [title]",
    "error": "Conflict",
    "timestamp": "2026-08-02T18:33:11.315554879"
}

==============

ERRO: transactionType minusculo não está contando. Por mim deixava esse BO pro frontend tratar, já que o usuário não iria digitar o enum na mão, masss sla

{
	"userId": 1,
	"name": "Teste",
	"transactionType": "income",
	"color": "FFFFFF",
	"icon": "https://picsum.photos/50/50"
}
{
	"status": 400,
	"message": "Preencha as informações e tente novamente",
	"error": "Bad Request",
	"timestamp": "2026-08-02T18:38:12.005088192"
}


    TODO TRATAR ESSES ERROS
    */

    // TODO FAZER FILTRO FILTRAR
    public List<Category> fetchCategories(TransactionType type) {
        if (type == null) return repo.findAll();
        return repo.findByTransactionType(type);
    } 

    public List<CategoryResponseDTO> getCategories(TransactionType type) {
        return fetchCategories(type)
        .stream()
        .map(obj -> mapper.toResponse(obj))
        .toList();
    } 

}

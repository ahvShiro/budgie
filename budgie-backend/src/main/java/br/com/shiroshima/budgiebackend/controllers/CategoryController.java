package br.com.shiroshima.budgiebackend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.shiroshima.budgiebackend.dtos.CategoryRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.CategoryResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.CategoryUpdateDTO;
import br.com.shiroshima.budgiebackend.models.enums.TransactionType;
import br.com.shiroshima.budgiebackend.services.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/v1/category")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService service;
    
    @PostMapping
    public ResponseEntity<CategoryResponseDTO> postCategory(@RequestBody CategoryRegisterDTO entity) {        
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registerCategory(entity));
    }

    @GetMapping
    public ResponseEntity<List<CategoryResponseDTO>> getCategories(@RequestParam(required = false) TransactionType type) {        
        return ResponseEntity.ok(service.getCategories(type));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> putMethodName(@PathVariable Long id, @Valid @RequestBody CategoryUpdateDTO data) {
        return ResponseEntity.ok(service.updateCategory(id, data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeCategory(@PathVariable Long id) {
        service.removeCategory(id);
        return ResponseEntity.noContent().build();
    }

}

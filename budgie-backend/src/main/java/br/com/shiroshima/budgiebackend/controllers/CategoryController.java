package br.com.shiroshima.budgiebackend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.shiroshima.budgiebackend.dtos.CategoryRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.CategoryResponseDTO;
import br.com.shiroshima.budgiebackend.models.enums.TransactionType;
import br.com.shiroshima.budgiebackend.services.CategoryService;
import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;


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
    public ResponseEntity<List<CategoryResponseDTO>> getCategories(@RequestParam(required = false) TransactionType transactionType) {        
        return ResponseEntity.ok(service.getCategories(transactionType));
    }

}

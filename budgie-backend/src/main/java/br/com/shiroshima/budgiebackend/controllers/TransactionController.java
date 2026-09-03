package br.com.shiroshima.budgiebackend.controllers;

import java.time.LocalDate;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.shiroshima.budgiebackend.dtos.transaction.TransactionRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.transaction.TransactionResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.transaction.TransactionUpdateDTO;
import br.com.shiroshima.budgiebackend.models.enums.TransactionType;
import br.com.shiroshima.budgiebackend.services.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/wallet/{walletId}/transaction")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService service;

    @PostMapping
    public ResponseEntity<TransactionResponseDTO> postTransaction(@PathVariable Long walletId, @Valid @RequestBody TransactionRegisterDTO data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registerTransaction(walletId, data));
    }

    @GetMapping
    public ResponseEntity<Page<TransactionResponseDTO>> getTransactions(
        @PathVariable Long walletId,
        @RequestParam(required = false) TransactionType type,
        @RequestParam(required = false) Long categoryId,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
        Pageable pageable
    ) {
        return ResponseEntity.ok(service.getTransactions(walletId, type, categoryId, startDate, endDate, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TransactionResponseDTO> getTransaction(@PathVariable Long walletId, @PathVariable Long id) {
        return ResponseEntity.ok(service.getTransaction(walletId, id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TransactionResponseDTO> updateTransaction(@PathVariable Long walletId, @PathVariable Long id, @Valid @RequestBody TransactionUpdateDTO data) {
        return ResponseEntity.ok(service.updateTransaction(walletId, id, data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeTransaction(@PathVariable Long walletId, @PathVariable Long id) {
        service.removeTransaction(walletId, id);
        return ResponseEntity.noContent().build();
    }

}

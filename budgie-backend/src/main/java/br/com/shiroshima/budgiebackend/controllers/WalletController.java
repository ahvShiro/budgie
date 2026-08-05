package br.com.shiroshima.budgiebackend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.shiroshima.budgiebackend.dtos.wallet.WalletRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.wallet.WalletResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.wallet.WalletUpdateDTO;
import br.com.shiroshima.budgiebackend.services.WalletService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService service;

    @PostMapping
    public ResponseEntity<WalletResponseDTO> postWallet(@Valid @RequestBody WalletRegisterDTO data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.registerWallet(data));
    }

    @GetMapping
    public ResponseEntity<List<WalletResponseDTO>> getWallets() {
        return ResponseEntity.ok(null);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WalletResponseDTO> getWallet(@PathVariable Long id) {
        return ResponseEntity.ok(service.getWallet(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<WalletResponseDTO> updateWallet(@PathVariable Long id, @Valid @RequestBody WalletUpdateDTO data) {
        return ResponseEntity.ok(service.updateWallet(id, data));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeWallet(@PathVariable Long id) {
        return ResponseEntity.noContent().build();
    }

}

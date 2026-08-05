package br.com.shiroshima.budgiebackend.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.shiroshima.budgiebackend.dtos.walletMember.WalletMemberRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.walletMember.WalletMemberResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.walletMember.WalletMemberUpdateDTO;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/wallet/{walletId}/member")
public class WalletMemberController {

    @PostMapping
    public ResponseEntity<WalletMemberResponseDTO> postMember(@PathVariable Long walletId, @Valid @RequestBody WalletMemberRegisterDTO data) {
        return ResponseEntity.status(HttpStatus.CREATED).body(null);
    }

    @GetMapping
    public ResponseEntity<List<WalletMemberResponseDTO>> getMembers(@PathVariable Long walletId) {
        return ResponseEntity.ok(null);
    }

    @PatchMapping("/{userId}")
    public ResponseEntity<WalletMemberResponseDTO> updateMemberRole(@PathVariable Long walletId, @PathVariable Long userId, @Valid @RequestBody WalletMemberUpdateDTO data) {
        return ResponseEntity.ok(null);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> removeMember(@PathVariable Long walletId, @PathVariable Long userId) {
        return ResponseEntity.noContent().build();
    }

}

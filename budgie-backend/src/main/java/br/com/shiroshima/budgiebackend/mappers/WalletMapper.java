package br.com.shiroshima.budgiebackend.mappers;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Component;

import br.com.shiroshima.budgiebackend.dtos.wallet.WalletListingDTO;
import br.com.shiroshima.budgiebackend.dtos.wallet.WalletRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.wallet.WalletResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.wallet.WalletUpdateDTO;
import br.com.shiroshima.budgiebackend.models.User;
import br.com.shiroshima.budgiebackend.models.Wallet;

@Component
public class WalletMapper {

    public Wallet toEntity(WalletRegisterDTO dto, User owner) {
        return new Wallet(
            owner,
            dto.name(),
            dto.description()
        );
    }

    public WalletResponseDTO toResponse(Wallet wallet) {
        return new WalletResponseDTO(
            wallet.getId(),
            wallet.getOwner().getId(),
            wallet.getName(),
            wallet.getDescription(),
            wallet.getCreatedAt(),
            wallet.getUpdatedAt(),
            wallet.isActive()
        );
    }

    public WalletListingDTO toListing(Wallet wallet, List<String> members, BigDecimal balance) {
        return new WalletListingDTO(
            wallet.getId(),
            wallet.getName(),
            wallet.getDescription(),
            members,
            balance
        );
    }

    public void updateEntity(Wallet wallet, WalletUpdateDTO dto) {
        wallet.setName(dto.name());
        wallet.setDescription(dto.description());
        wallet.setActive(dto.active());
    }

}

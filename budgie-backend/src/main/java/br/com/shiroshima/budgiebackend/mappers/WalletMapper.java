package br.com.shiroshima.budgiebackend.mappers;

import org.springframework.stereotype.Component;

import br.com.shiroshima.budgiebackend.dtos.wallet.WalletRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.wallet.WalletResponseDTO;
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

}

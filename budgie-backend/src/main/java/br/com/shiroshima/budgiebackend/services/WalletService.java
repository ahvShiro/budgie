package br.com.shiroshima.budgiebackend.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import br.com.shiroshima.budgiebackend.dtos.wallet.WalletRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.wallet.WalletResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.wallet.WalletUpdateDTO;
import br.com.shiroshima.budgiebackend.mappers.WalletMapper;
import br.com.shiroshima.budgiebackend.models.Wallet;
import br.com.shiroshima.budgiebackend.repositories.WalletRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@Validated
@RequiredArgsConstructor
public class WalletService {

    private final WalletRepository repo;
    private final WalletMapper mapper;
    private final UserService userService;

    public WalletResponseDTO registerWallet(@Valid WalletRegisterDTO data) {
        // TODO falta gravar o WalletMember do dono com papel OWNER
        Wallet newWallet = mapper.toEntity(data, userService.fetchAuthenticatedUser());
        repo.save(newWallet);
        return mapper.toResponse(newWallet);
    }


}

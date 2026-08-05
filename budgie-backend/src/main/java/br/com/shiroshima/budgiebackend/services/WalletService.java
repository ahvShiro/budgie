package br.com.shiroshima.budgiebackend.services;

import java.util.List;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import br.com.shiroshima.budgiebackend.dtos.wallet.WalletRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.wallet.WalletResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.wallet.WalletUpdateDTO;
import br.com.shiroshima.budgiebackend.exceptions.ResourceNotFoundException;
import br.com.shiroshima.budgiebackend.mappers.WalletMapper;
import br.com.shiroshima.budgiebackend.models.Wallet;
import br.com.shiroshima.budgiebackend.repositories.TransactionRepository;
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
    private final TransactionRepository transactionRepo;

    // Métodos internos

    public Wallet fetchById(Long id) {
        return repo.findByIdAndActive(id, true).orElseThrow(() -> new ResourceNotFoundException("Carteira não encontrada"));
    }

    // TODO enquanto WalletMember não existe só o dono passa
    public void checkAccess(Wallet wallet) {
        if (!wallet.getOwner().getId().equals(userService.fetchAuthenticatedUser().getId())) {
            throw new AccessDeniedException("Você não tem acesso a esta carteira");
        }
    }

    public void checkOwner(Wallet wallet) {
        if (!wallet.getOwner().getId().equals(userService.fetchAuthenticatedUser().getId())) {
            throw new AccessDeniedException("Apenas o dono pode alterar esta carteira");
        }
    }

    public void deactivateWallet(Wallet wallet) {
        wallet.setActive(false);
        repo.save(wallet);
        transactionRepo.deactivateByWalletId(wallet.getId());
    }

    // Métodos externos

    public WalletResponseDTO registerWallet(@Valid WalletRegisterDTO data) {
        // TODO falta gravar o WalletMember do dono com papel OWNER
        Wallet newWallet = mapper.toEntity(data, userService.fetchAuthenticatedUser());
        repo.save(newWallet);
        return mapper.toResponse(newWallet);
    }

    // TODO enquanto WalletMember não existe só traz as minhas carteiras
    public List<WalletResponseDTO> getWallets() {
        return repo.findByOwnerIdAndActive(userService.fetchAuthenticatedUser().getId(), true)
        .stream()
        .map(obj -> mapper.toResponse(obj))
        .toList();
    }

    public WalletResponseDTO getWallet(Long id) {
        Wallet wallet = fetchById(id);
        checkAccess(wallet);
        return mapper.toResponse(wallet);
    }

    public WalletResponseDTO updateWallet(Long id, @Valid WalletUpdateDTO data) {
        Wallet old = fetchById(id);
        checkOwner(old);

        mapper.updateEntity(old, data);
        repo.save(old);
        return mapper.toResponse(old);
    }

    @Transactional
    public void removeWallet(Long id) {
        Wallet wallet = fetchById(id);
        checkOwner(wallet);
        deactivateWallet(wallet);
    }

}

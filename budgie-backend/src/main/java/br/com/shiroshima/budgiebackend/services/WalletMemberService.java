package br.com.shiroshima.budgiebackend.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import br.com.shiroshima.budgiebackend.dtos.walletMember.WalletMemberRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.walletMember.WalletMemberResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.walletMember.WalletMemberUpdateDTO;
import br.com.shiroshima.budgiebackend.exceptions.BusinessException;
import br.com.shiroshima.budgiebackend.exceptions.ConflictException;
import br.com.shiroshima.budgiebackend.exceptions.ResourceNotFoundException;
import br.com.shiroshima.budgiebackend.mappers.WalletMemberMapper;
import br.com.shiroshima.budgiebackend.models.User;
import br.com.shiroshima.budgiebackend.models.Wallet;
import br.com.shiroshima.budgiebackend.models.WalletMember;
import br.com.shiroshima.budgiebackend.models.enums.WalletRole;
import br.com.shiroshima.budgiebackend.repositories.WalletMemberRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Service
@Validated
@RequiredArgsConstructor
public class WalletMemberService {

    private final WalletMemberRepository repo;
    private final WalletMemberMapper mapper;
    private final WalletService walletService;
    private final UserService userService;

    // Métodos internos

    public WalletMember fetchByWalletAndUser(Long walletId, Long userId) {
        return repo.findByWalletIdAndUserId(walletId, userId)
            .orElseThrow(() -> new ResourceNotFoundException("Membro não encontrado"));
    }

    public List<WalletMember> fetchByWallet(Long walletId) {
        return repo.findByWalletId(walletId);
    }

    // Métodos externos

    public WalletMemberResponseDTO registerMember(Long walletId, @Valid WalletMemberRegisterDTO data) {
        Wallet wallet = walletService.fetchById(walletId);
        walletService.checkOwner(wallet);

        if (data.role() == WalletRole.OWNER) {
            throw new BusinessException("A carteira só pode ter um dono");
        }

        User user = userService.fetchByEmail(data.email())
            .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

        if (user.getId().equals(wallet.getOwner().getId())) {
            throw new ConflictException("O dono já faz parte da carteira");
        }

        if (repo.existsByWalletIdAndUserId(walletId, user.getId())) {
            throw new ConflictException("Este usuário já faz parte da carteira");
        }

        WalletMember newMember = mapper.toEntity(wallet, user, data.role());
        repo.save(newMember);
        return mapper.toResponse(newMember);
    }

    public List<WalletMemberResponseDTO> getMembers(Long walletId) {
        Wallet wallet = walletService.fetchById(walletId);
        walletService.checkAccess(wallet);

        return fetchByWallet(walletId)
        .stream()
        .map(obj -> mapper.toResponse(obj))
        .toList();
    }

    public WalletMemberResponseDTO updateMemberRole(Long walletId, Long userId, @Valid WalletMemberUpdateDTO data) {
        Wallet wallet = walletService.fetchById(walletId);
        walletService.checkOwner(wallet);

        if (data.role() == WalletRole.OWNER) {
            throw new BusinessException("A carteira só pode ter um dono");
        }

        // Impedir softlock do dono da carteira por ele mesmo
        if (userId.equals(wallet.getOwner().getId())) {
            throw new BusinessException("O papel do dono não pode ser alterado");
        }

        WalletMember old = fetchByWalletAndUser(walletId, userId);

        mapper.updateEntity(old, data);
        repo.save(old);
        return mapper.toResponse(old);
    }

}

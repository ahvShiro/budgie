package br.com.shiroshima.budgiebackend.services;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;

import br.com.shiroshima.budgiebackend.dtos.wallet.WalletListingDTO;
import br.com.shiroshima.budgiebackend.dtos.wallet.WalletRegisterDTO;
import br.com.shiroshima.budgiebackend.dtos.wallet.WalletResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.wallet.WalletUpdateDTO;
import br.com.shiroshima.budgiebackend.exceptions.ResourceNotFoundException;
import br.com.shiroshima.budgiebackend.mappers.WalletMapper;
import br.com.shiroshima.budgiebackend.models.Category;
import br.com.shiroshima.budgiebackend.models.User;
import br.com.shiroshima.budgiebackend.models.Wallet;
import br.com.shiroshima.budgiebackend.models.WalletMember;
import br.com.shiroshima.budgiebackend.models.enums.TransactionType;
import br.com.shiroshima.budgiebackend.models.enums.WalletRole;
import br.com.shiroshima.budgiebackend.repositories.CategoryRepository;
import br.com.shiroshima.budgiebackend.repositories.TransactionRepository;
import br.com.shiroshima.budgiebackend.repositories.WalletMemberRepository;
import br.com.shiroshima.budgiebackend.repositories.WalletRepository;
import br.com.shiroshima.budgiebackend.repositories.projections.WalletBalance;
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
    private final WalletMemberRepository walletMemberRepo;
    // Repo e não CategoryService pq o CategoryService já depende deste service (ciclo de bean)
    private final CategoryRepository categoryRepo;

    // Toda carteira nasce com essas, cor em hex sem o #
    private record DefaultCategory(String name, TransactionType type, String color) {}

    private static final List<DefaultCategory> DEFAULT_CATEGORIES = List.of(
        new DefaultCategory("Salário", TransactionType.INCOME, "2563eb"),
        new DefaultCategory("Outras receitas", TransactionType.INCOME, "0891b2"),
        new DefaultCategory("Alimentação", TransactionType.EXPENSE, "dc2626"),
        new DefaultCategory("Moradia", TransactionType.EXPENSE, "ea580c"),
        new DefaultCategory("Transporte", TransactionType.EXPENSE, "ca8a04"),
        new DefaultCategory("Saúde", TransactionType.EXPENSE, "db2777"),
        new DefaultCategory("Lazer", TransactionType.EXPENSE, "7c3aed"),
        new DefaultCategory("Outras despesas", TransactionType.EXPENSE, "64748b")
    );

    // Métodos internos

    public Wallet fetchById(Long id) {
        return repo.findByIdAndActive(id, true).orElseThrow(() -> new ResourceNotFoundException("Carteira não encontrada"));
    }

    public void checkAccess(Wallet wallet) {
        if (!walletMemberRepo.existsByWalletIdAndUserId(wallet.getId(), userService.fetchAuthenticatedUser().getId())) {
            throw new AccessDeniedException("Você não tem acesso a esta carteira");
        }
    }

    public void checkOwner(Wallet wallet) {
        if (!wallet.getOwner().getId().equals(userService.fetchAuthenticatedUser().getId())) {
            throw new AccessDeniedException("Apenas o dono pode alterar esta carteira");
        }
    }

    @Transactional
    public void deactivateWallet(Wallet wallet) {
        wallet.setActive(false);
        repo.save(wallet);
        transactionRepo.deactivateByWalletId(wallet.getId());
        categoryRepo.deactivateByWalletId(wallet.getId());
    }

    // Métodos externos

    // Transactional porque são duas escritas
    @Transactional
    public WalletResponseDTO registerWallet(@Valid WalletRegisterDTO data) {
        User owner = userService.fetchAuthenticatedUser();

        Wallet newWallet = mapper.toEntity(data, owner);
        repo.save(newWallet);
        walletMemberRepo.save(new WalletMember(newWallet, owner, WalletRole.OWNER));
        categoryRepo.saveAll(DEFAULT_CATEGORIES.stream()
            .map(d -> new Category(newWallet, d.name(), d.type(), d.color(), null))
            .toList());

        return mapper.toResponse(newWallet);
    }

    public List<WalletListingDTO> getWallets() {
        List<Wallet> wallets = walletMemberRepo.findByUserIdAndWalletActive(userService.fetchAuthenticatedUser().getId(), true)
        .stream()
        .map(WalletMember::getWallet)
        .toList();

        if (wallets.isEmpty()) {
            return List.of();
        }

        List<Long> walletIds = wallets.stream().map(Wallet::getId).toList();

        Map<Long, List<String>> membersByWallet = walletMemberRepo.findByWalletIdIn(walletIds)
        .stream()
        .collect(Collectors.groupingBy(
            member -> member.getWallet().getId(),
            Collectors.mapping(member -> member.getUser().getName(), Collectors.toList())
        ));

        Map<Long, BigDecimal> balanceByWallet = transactionRepo.sumBalanceByWalletIds(walletIds)
        .stream()
        .collect(Collectors.toMap(WalletBalance::getWalletId, WalletBalance::getBalance));

        return wallets.stream()
        .map(wallet -> mapper.toListing(
            wallet,
            membersByWallet.getOrDefault(wallet.getId(), List.of()),
            balanceByWallet.getOrDefault(wallet.getId(), BigDecimal.ZERO)
        ))
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

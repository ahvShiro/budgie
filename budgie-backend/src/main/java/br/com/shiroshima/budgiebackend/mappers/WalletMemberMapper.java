package br.com.shiroshima.budgiebackend.mappers;

import org.springframework.stereotype.Component;

import br.com.shiroshima.budgiebackend.dtos.walletMember.WalletMemberResponseDTO;
import br.com.shiroshima.budgiebackend.dtos.walletMember.WalletMemberUpdateDTO;
import br.com.shiroshima.budgiebackend.models.User;
import br.com.shiroshima.budgiebackend.models.Wallet;
import br.com.shiroshima.budgiebackend.models.WalletMember;
import br.com.shiroshima.budgiebackend.models.enums.WalletRole;

@Component
public class WalletMemberMapper {

    public WalletMember toEntity(Wallet wallet, User user, WalletRole role) {
        return new WalletMember(
            wallet,
            user,
            role
        );
    }

    public WalletMemberResponseDTO toResponse(WalletMember member) {
        return new WalletMemberResponseDTO(
            member.getId(),
            member.getWallet().getId(),
            member.getUser().getId(),
            member.getUser().getName(),
            member.getUser().getEmail(),
            member.getRole(),
            member.getCreatedAt()
        );
    }

    public void updateEntity(WalletMember member, WalletMemberUpdateDTO dto) {
        member.setRole(dto.role());
    }

}

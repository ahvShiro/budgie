package br.com.shiroshima.budgiebackend.models.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AuthRole {
    ADMIN("Admininastro"), USER("Usuário");

    private String role;
}

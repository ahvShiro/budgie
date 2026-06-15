package br.com.shiroshima.budgiebackend.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AuthRole {
    ADMIN("Admininastro"), USER("Usuário");

    private String role;
}

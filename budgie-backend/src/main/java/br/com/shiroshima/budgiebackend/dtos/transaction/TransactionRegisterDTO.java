package br.com.shiroshima.budgiebackend.dtos.transaction;

import java.math.BigDecimal;
import java.time.LocalDate;

import br.com.shiroshima.budgiebackend.models.enums.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

// walletId vem do path e createdBy vem do usuário autenticado, por isso nenhum dos dois está aqui
public record TransactionRegisterDTO(
    Long categoryId,

    @NotNull(message = "{type.shouldrequired}")
    TransactionType type,

    @NotNull(message = "{value.shouldrequired}")
    @DecimalMin(value = "0.01", message = "{value.shouldpositive}")
    BigDecimal value,

    @Size(max = 128, message = "{description.shouldmax}")
    String description,

    @NotNull(message = "{date.shouldrequired}")
    @PastOrPresent(message = "{date.shouldpastorpresent}")
    LocalDate date
) {}

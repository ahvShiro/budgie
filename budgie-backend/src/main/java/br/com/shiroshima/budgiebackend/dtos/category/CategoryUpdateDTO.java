package br.com.shiroshima.budgiebackend.dtos.category;

import org.hibernate.validator.constraints.URL;

import br.com.shiroshima.budgiebackend.models.enums.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record CategoryUpdateDTO (
    @NotBlank(message = "{name.shouldrequired}")
    String name,

    @NotNull
    TransactionType transactionType,

    @Pattern(regexp = "^[0-9a-fA-F]*$", message = "{color.shouldvalid}")
    @Size(max = 6, message = "{color.shouldmax}")
    String color,

    @URL(message = "{icon.shouldvalid}")
    String icon,

    @NotNull
    Boolean active

) {
    
}

package br.com.shiroshima.budgiebackend.exceptions;

import java.time.LocalDateTime;

import org.springframework.http.HttpStatus;

import lombok.Getter;

@Getter
public class ErrorMessage {
    // { "timestamp": "2025-01-01T10:00:00", "status": 404, "error": "Not Found", "message": "Usuário não encontrado" }

    private LocalDateTime timestamp;
    private int status;
    private String error;
    private String message;

    public ErrorMessage(HttpStatus status, String message) {
        this.timestamp = LocalDateTime.now();
        this.status = status.value();
        this.error = status.getReasonPhrase();
        this.message = message;
    }
}

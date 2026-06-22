package br.com.shiroshima.budgiebackend.exceptions;

import java.nio.file.AccessDeniedException;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;


@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorMessage> handleUnhandledException(Exception ex) {
        ErrorMessage e = new ErrorMessage(
            HttpStatus.INTERNAL_SERVER_ERROR, 
            "Erro inesperado! Contate o administrador"
        );
        return ResponseEntity.status(e.getStatus()).body(e);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorMessage> handleResourceNotFoundException(ResourceNotFoundException ex) {
        ErrorMessage e = new ErrorMessage(
            HttpStatus.INTERNAL_SERVER_ERROR, 
            "Erro inesperado! Contate o administrador"
        );
        return ResponseEntity.status(e.getStatus()).body(e);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorMessage> handleBusinessException(BusinessException ex) {
        ErrorMessage e = new ErrorMessage(
            HttpStatus.UNPROCESSABLE_CONTENT, 
            ex.getMessage()
        );
        return ResponseEntity.status(e.getStatus()).body(e);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorMessage> handleAccessDeniedException(AccessDeniedException ex) {
        ErrorMessage e = new ErrorMessage(
            HttpStatus.FORBIDDEN, 
            "Acesso negado. Verifique se está autenticado e tente novamente"
        );
        return ResponseEntity.status(e.getStatus()).body(e);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorMessage> handleMethodArgumentNotValidException(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream().map(FieldError::getDefaultMessage).collect(Collectors.joining("; "));
        
        ErrorMessage e = new ErrorMessage(
            HttpStatus.BAD_REQUEST, 
            message
        );
        return ResponseEntity.status(e.getStatus()).body(e);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorMessage> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        ErrorMessage e = new ErrorMessage(
            HttpStatus.CONFLICT, 
            ex.getMessage()
        );
        return ResponseEntity.status(e.getStatus()).body(e);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorMessage> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        ErrorMessage e = new ErrorMessage(
            HttpStatus.BAD_REQUEST,     
            "Preencha as informações e tente novamente"
        );
        return ResponseEntity.status(e.getStatus()).body(e);
    }

}

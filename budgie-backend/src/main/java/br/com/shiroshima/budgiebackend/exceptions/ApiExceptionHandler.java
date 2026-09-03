package br.com.shiroshima.budgiebackend.exceptions;

import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;

import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;


@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorMessage> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException ex) {
        ErrorMessage e = new ErrorMessage(
            HttpStatus.BAD_REQUEST,
            "Verifique as informações e tente novamente"
        );
        return ResponseEntity.status(e.getStatus()).body(e);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorMessage> handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException ex) {
        ErrorMessage e = new ErrorMessage(
            HttpStatus.METHOD_NOT_ALLOWED,
            "Método não suportado nesta rota"
        );
        return ResponseEntity.status(e.getStatus()).body(e);
    }


    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorMessage> handleResourceNotFoundException(ResourceNotFoundException ex) {
        ErrorMessage e = new ErrorMessage(
            HttpStatus.NOT_FOUND, 
            ex.getMessage()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e);
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorMessage> handleBusinessException(BusinessException ex) {
        ErrorMessage e = new ErrorMessage(
            HttpStatus.UNPROCESSABLE_CONTENT, 
            ex.getMessage()
        );
        return ResponseEntity.status(e.getStatus()).body(e);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ErrorMessage> handleConflictException(ConflictException ex) {
        ErrorMessage e = new ErrorMessage(
            HttpStatus.CONFLICT,
            ex.getMessage()
        );
        return ResponseEntity.status(e.getStatus()).body(e);
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ErrorMessage> handleInvalidTokenException(InvalidTokenException ex) {
        ErrorMessage e = new ErrorMessage(
            HttpStatus.BAD_REQUEST,
            ex.getMessage()
        );
        return ResponseEntity.status(e.getStatus()).body(e);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorMessage> handleConstraintViolationException(ConstraintViolationException ex) {
        String message = ex.getConstraintViolations().stream()
            .map(ConstraintViolation::getMessage)
            .collect(Collectors.joining("; "));

        ErrorMessage e = new ErrorMessage(HttpStatus.BAD_REQUEST, message);
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
            "Erro no banco de dados. Contatar o admin"
        );
        return ResponseEntity.status(e.getStatus()).body(e);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorMessage> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        ErrorMessage e = new ErrorMessage(
            HttpStatus.BAD_REQUEST,     
            "Verifique as informações e tente novamente"
        );
        return ResponseEntity.status(e.getStatus()).body(e);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorMessage> handleAuthenticationException(AuthenticationException ex) {
        ErrorMessage e = new ErrorMessage(
            HttpStatus.UNAUTHORIZED,
            "E-mail ou senha inválidos"
        );
        return ResponseEntity.status(e.getStatus()).body(e);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorMessage> handleUnhandledException(Exception ex) {
        ErrorMessage e = new ErrorMessage(
            HttpStatus.INTERNAL_SERVER_ERROR, 
            "Erro inesperado! Contate o administrador"
        );
        return ResponseEntity.status(e.getStatus()).body(e);
    }

}

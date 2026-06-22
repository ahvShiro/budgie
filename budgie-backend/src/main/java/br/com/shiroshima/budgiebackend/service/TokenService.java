package br.com.shiroshima.budgiebackend.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;

import br.com.shiroshima.budgiebackend.model.User;



@Service
public class TokenService {
    @Value("${api.security.token.secret}")
    private String secret;

    @Value("${api.security.token.issuer:budgie-backend}")
    private String issuer;

    @Value("${api.security.token.expiration.hours:2}")
    private int expirationHours;

    @Value("${api.security.token.timezone.offset:-03:00}")
    private String timezoneOffset;

    public String generateToken(User user) {
        try {
            Algorithm algo = Algorithm.HMAC256(secret);
            String token = JWT.create()
                    .withIssuer(issuer)
                    .withSubject(user.getEmail())
                    .withExpiresAt(generateExpirationDate())
                    .sign(algo);
            return token;
        } catch (JWTCreationException e) {
            throw new RuntimeException("Error generating token: " + e.getMessage());
        }
    }

    public String validateToken(String token) {
        try {
            Algorithm algo = Algorithm.HMAC256(secret);
            return JWT.require(algo)
                    .withIssuer(issuer)
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException e) {
            return "";
        }
    }

    private Instant generateExpirationDate() {
        return LocalDateTime.now()
                .plusHours(expirationHours)
                .toInstant(ZoneOffset.of(timezoneOffset));
    }
}

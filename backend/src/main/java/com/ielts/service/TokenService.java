package com.ielts.service;

import com.ielts.entity.Token;
import com.ielts.entity.User;
import com.ielts.repository.TokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
public class TokenService {

    @Autowired
    private TokenRepository tokenRepository;

    private static final SecureRandom secureRandom = new SecureRandom();

    @Value("${jwt.expiration:86400000}")
    private long defaultExpirationMillis;

    private String generateSecureToken(int bytes) {
        byte[] b = new byte[bytes];
        secureRandom.nextBytes(b);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(b);
    }

    @Transactional
    public Token createEmailVerificationToken(User user) {
        String tokenStr = generateSecureToken(32);
        Token t = new Token();
        t.setToken(tokenStr);
        t.setUser(user);
        t.setType(Token.TokenType.EMAIL_VERIFICATION);
        t.setExpiresAt(LocalDateTime.now().plusHours(24));
        t.setUsed(false);
        return tokenRepository.save(t);
    }

    @Transactional
    public Token createPasswordResetToken(User user) {
        String tokenStr = generateSecureToken(32);
        Token t = new Token();
        t.setToken(tokenStr);
        t.setUser(user);
        t.setType(Token.TokenType.PASSWORD_RESET);
        t.setExpiresAt(LocalDateTime.now().plusMinutes(15));
        t.setUsed(false);
        return tokenRepository.save(t);
    }

    @Transactional(readOnly = true)
    public Token findByToken(String token) {
        return tokenRepository.findByToken(token).orElse(null);
    }

    @Transactional(readOnly = true)
    public Token findActiveTokenByUserAndType(User user, Token.TokenType type) {
        return tokenRepository.findByUserAndType(user, type).filter(t -> !t.getUsed() && t.getExpiresAt().isAfter(LocalDateTime.now())).orElse(null);
    }

    @Transactional
    public void markUsed(Token token) {
        token.setUsed(true);
        tokenRepository.save(token);
    }
}

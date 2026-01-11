package com.ielts.controller;

import com.ielts.dto.AuthRequest;
import com.ielts.dto.AuthResponse;
import com.ielts.dto.GoogleSignInRequest;
import com.ielts.dto.SignUpRequest;
import com.ielts.service.AuthService;
import com.ielts.service.TokenService;
import com.ielts.service.EmailService;
import com.ielts.entity.Token;
import com.ielts.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private AuthService authService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private com.ielts.repository.UserRepository userRepository;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username:}")
    private String springMailUsername;
    
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> signIn(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.signIn(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signUp(@Valid @RequestBody SignUpRequest request) {
        try {
            AuthResponse response = authService.signUp(request);

            // After creating user, send verification email (non-blocking failure)
            try {
                com.ielts.entity.User user = userRepository.findByEmail(request.getEmail()).orElse(null);
                if (user != null) {
                    com.ielts.entity.Token token = tokenService.createEmailVerificationToken(user);
                    String frontend = org.springframework.beans.factory.annotation.Value.class.getName();
                    String frontendUrl = System.getenv().getOrDefault("FRONTEND_URL", "http://localhost:3000");
                    String link = String.format("%s/verify-email?token=%s", frontendUrl, token.getToken());
                    String body = "Hi " + user.getFirstName() + ",\n\n" +
                            "Please verify your email by clicking the link below:\n" + link + "\n\n" +
                            "This link expires in 24 hours.\n\n" +
                            "If you did not create an account, you can ignore this email.";
                    try { emailService.sendSimpleMessage(user.getEmail(), "Verify your email", body); } catch (Exception e) { /* swallow */ }
                }
            } catch (Exception e) {
                // do not fail registration on email issues
                System.err.println("Failed to send verification email: " + e.getMessage());
            }

            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam("token") String tokenStr) {
        Token token = tokenService.findByToken(tokenStr);
        if (token == null || token.getType() != Token.TokenType.EMAIL_VERIFICATION) {
            return ResponseEntity.badRequest().build();
        }
        if (token.getUsed() || token.getExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().build();
        }

        com.ielts.entity.User user = token.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);
        tokenService.markUsed(token);

        boolean dev = springMailUsername == null || springMailUsername.trim().isEmpty();
        AuthResponse response = authService.authResponseForUser(user);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody java.util.Map<String, String> payload) {
        String email = payload.getOrDefault("email", "").toLowerCase().trim();
        try {
            com.ielts.entity.User user = userRepository.findByEmail(email).orElse(null);
            if (user != null) {
                // Rate limit: reuse existing active token if one exists and is not too new
                Token existing = tokenService.findActiveTokenByUserAndType(user, Token.TokenType.PASSWORD_RESET);
                if (existing != null) {
                    // If existing token is recent (<60 seconds), skip creating a new one
                    if (existing.getCreatedAt() != null && existing.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusSeconds(60))) {
                        // reuse existing token
                    } else {
                        existing = tokenService.createPasswordResetToken(user);
                    }
                } else {
                    existing = tokenService.createPasswordResetToken(user);
                }
                Token t = existing;
                String frontendUrl = System.getenv().getOrDefault("FRONTEND_URL", "http://localhost:3000");
                String link = String.format("%s/reset-password?token=%s", frontendUrl, t.getToken());
                String body = "Hi " + user.getFirstName() + ",\n\n" +
                        "A request to reset your password was received. Click the link below to reset your password:\n" + link + "\n\n" +
                        "This link expires in 15 minutes. If you didn't request this, ignore this email.";
                try { emailService.sendSimpleMessage(user.getEmail(), "Reset your password", body); } catch (Exception e) { /* swallow */ }
            }
        } catch (Exception e) {
            // swallow to avoid exposing info
        }
        // Always return generic response
        return ResponseEntity.ok().build();
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestBody java.util.Map<String, String> payload) {
        String email = payload.getOrDefault("email", "").toLowerCase().trim();
        try {
            com.ielts.entity.User user = userRepository.findByEmail(email).orElse(null);
            if (user != null && !Boolean.TRUE.equals(user.getEmailVerified())) {
                Token existing = tokenService.findActiveTokenByUserAndType(user, Token.TokenType.EMAIL_VERIFICATION);
                if (existing != null) {
                    // reuse existing token if recent (<60s), else create a new one
                    if (existing.getCreatedAt() != null && existing.getCreatedAt().isAfter(java.time.LocalDateTime.now().minusSeconds(60))) {
                        // reuse
                    } else {
                        existing = tokenService.createEmailVerificationToken(user);
                    }
                } else {
                    existing = tokenService.createEmailVerificationToken(user);
                }
                Token t = existing;
                String frontendUrl = System.getenv().getOrDefault("FRONTEND_URL", "http://localhost:3000");
                String link = String.format("%s/verify-email?token=%s", frontendUrl, t.getToken());
                String body = "Hi " + user.getFirstName() + ",\n\n" +
                        "Please verify your email by clicking the link below:\n" + link + "\n\n" +
                        "This link expires in 24 hours.\n\n" +
                        "If you did not request this, you can ignore this email.";
                try { emailService.sendSimpleMessage(user.getEmail(), "Verify your email", body); } catch (Exception e) { /* swallow */ }
            }
        } catch (Exception e) {
            // swallow to avoid user enumeration
        }
        boolean dev = springMailUsername == null || springMailUsername.trim().isEmpty();
        java.util.Map<String, Object> resp = java.util.Collections.singletonMap("dev", dev);
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody java.util.Map<String, String> payload) {
        String tokenStr = payload.getOrDefault("token", "");
        String newPassword = payload.getOrDefault("password", "");
        if (tokenStr.isEmpty() || newPassword.length() < 6) {
            return ResponseEntity.badRequest().body("Invalid request");
        }

        Token token = tokenService.findByToken(tokenStr);
        if (token == null || token.getType() != Token.TokenType.PASSWORD_RESET) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }
        if (token.getUsed() || token.getExpiresAt().isBefore(java.time.LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }

        com.ielts.entity.User user = token.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokenService.markUsed(token);

        return ResponseEntity.ok().build();
    }
    
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleSignIn(@Valid @RequestBody GoogleSignInRequest request) {
        AuthResponse response = authService.googleSignIn(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/anonymous")
    public ResponseEntity<AuthResponse> anonymousSignIn() {
        AuthResponse response = authService.anonymousSignIn();
        return ResponseEntity.ok(response);
    }
}



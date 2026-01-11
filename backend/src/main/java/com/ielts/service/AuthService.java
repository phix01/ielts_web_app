package com.ielts.service;

import com.ielts.dto.AuthRequest;
import com.ielts.dto.AuthResponse;
import com.ielts.dto.GoogleSignInRequest;
import com.ielts.dto.SignUpRequest;
import com.ielts.entity.PremiumUser;
import com.ielts.entity.User;
import com.ielts.repository.PremiumUserRepository;
import com.ielts.repository.UserRepository;
import com.ielts.security.JwtTokenProvider;
import com.ielts.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PremiumUserRepository premiumUserRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    @Transactional
    public AuthResponse signIn(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findByEmail(userPrincipal.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        boolean isPremium = premiumUserRepository.existsByUser(user);
        
        return new AuthResponse(
            token,
            "Bearer",
            user.getId(),
            user.getUid(),
            user.getEmail(),
            user.getFirstName(),
            user.getUserImage(),
            isPremium
            ,
            user.getEmailVerified()
        );
    }
    
    @Transactional
    public AuthResponse signUp(SignUpRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }
        
        User user = new User();
        user.setUid(UUID.randomUUID().toString());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setProvider("email");
        user.setUserImage("https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTP6HBlxRaCn7CViHiZrhpx1Sx4GHM-dafYZZjW0eizMFidSQRS&usqp=CAU");
        user.setIsPremium(false);
        
        user = userRepository.save(user);
        
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        
        String token = tokenProvider.generateToken(authentication);
        
        return new AuthResponse(
            token,
            "Bearer",
            user.getId(),
            user.getUid(),
            user.getEmail(),
            user.getFirstName(),
            user.getUserImage(),
            false,
            user.getEmailVerified()
        );
    }
    
    @Transactional
    public AuthResponse googleSignIn(GoogleSignInRequest request) {
        // In production, verify the Google ID token server-side
        // For now, we'll create/update user based on email from token
        
        // Extract email from Google token (simplified - should verify token properly)
        // This is a placeholder - implement proper Google token verification
        
        // Extract email from Google token (simplified - should verify token properly)
        // In production, verify Google ID token using Google's API
        String email = extractEmailFromGoogleToken(request.getIdToken()); // Placeholder
        
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUid(UUID.randomUUID().toString());
                    newUser.setEmail(email);
                    newUser.setProvider("google");
                    newUser.setProviderId(request.getIdToken());
                    newUser.setFirstName(request.getDisplayName() != null ? 
                        request.getDisplayName().split(" ")[0] : "User");
                    newUser.setUserImage(request.getPhotoUrl());
                    newUser.setIsPremium(false);
                    return userRepository.save(newUser);
                });
        
        // Update user info if changed
        if (request.getDisplayName() != null) {
            String firstName = request.getDisplayName().contains(" ") ? 
                request.getDisplayName().substring(0, request.getDisplayName().indexOf(" ")) : 
                request.getDisplayName();
            if (!firstName.equals(user.getFirstName())) {
                user.setFirstName(firstName);
            }
        }
        if (request.getPhotoUrl() != null && !request.getPhotoUrl().equals(user.getUserImage())) {
            user.setUserImage(request.getPhotoUrl());
        }
        user = userRepository.save(user);
        
        // For Google OAuth, create authentication manually
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            userPrincipal, null, userPrincipal.getAuthorities()
        );
        
        String token = tokenProvider.generateToken(authentication);
        boolean isPremium = premiumUserRepository.existsByUser(user);
        
        return new AuthResponse(
            token,
            "Bearer",
            user.getId(),
            user.getUid(),
            user.getEmail(),
            user.getFirstName(),
            user.getUserImage(),
            isPremium
            ,
            user.getEmailVerified()
        );
    }
    
    @Transactional
    public AuthResponse anonymousSignIn() {
        User user = new User();
        user.setUid(UUID.randomUUID().toString());
        user.setEmail("guest_" + UUID.randomUUID() + "@email.com");
        user.setFirstName("Guest");
        user.setProvider("anonymous");
        user.setUserImage("https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTP6HBlxRaCn7CViHiZrhpx1Sx4GHM-dafYZZjW0eizMFidSQRS&usqp=CAU");
        user.setIsPremium(false);
        
        user = userRepository.save(user);
        
        // For anonymous users, create authentication manually
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            userPrincipal, null, userPrincipal.getAuthorities()
        );
        
        String token = tokenProvider.generateToken(authentication);
        
        return new AuthResponse(
            token,
            "Bearer",
            user.getId(),
            user.getUid(),
            user.getEmail(),
            user.getFirstName(),
            user.getUserImage(),
            false,
            user.getEmailVerified()
        );
    }

    @Transactional
    public AuthResponse authResponseForUser(User user) {
        // Create principal and authentication manually
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        Authentication authentication = new UsernamePasswordAuthenticationToken(
            userPrincipal, null, userPrincipal.getAuthorities()
        );
        String token = tokenProvider.generateToken(authentication);
        boolean isPremium = premiumUserRepository.existsByUser(user);

        return new AuthResponse(
            token,
            "Bearer",
            user.getId(),
            user.getUid(),
            user.getEmail(),
            user.getFirstName(),
            user.getUserImage(),
            isPremium,
            user.getEmailVerified()
        );
    }
    
    private String extractEmailFromGoogleToken(String idToken) {
        // Placeholder - in production, verify and decode Google ID token
        // This should use Google's token verification API
        // For now, return a placeholder - implement proper Google token verification
        return "user@example.com"; // Replace with actual email extraction from verified token
    }
}


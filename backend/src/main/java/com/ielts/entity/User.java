package com.ielts.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String uid; // Firebase-style UID for compatibility
    
    @Column(nullable = false)
    private String firstName;
    
    @Column(unique = true, nullable = false)
    private String email;
    
    private String password; // Hashed password, nullable for Google OAuth users
    
    private String userImage;
    
    private String provider; // "email", "google", "anonymous"
    
    private String providerId; // Google ID for OAuth users
    
    @Column(nullable = false)
    private Boolean isPremium = false;

    @Column(nullable = false, columnDefinition = "boolean default false")
    private Boolean emailVerified = false;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}



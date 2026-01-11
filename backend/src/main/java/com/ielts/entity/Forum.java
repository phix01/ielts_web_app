package com.ielts.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "forums")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Forum {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    private String firstName; // Denormalized for quick access
    
    private String userImage; // Denormalized for quick access
    
    @ElementCollection
    @CollectionTable(name = "forum_tags", joinColumns = @JoinColumn(name = "forum_id"))
    @Column(name = "tag")
    private List<String> tags;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime sentAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}



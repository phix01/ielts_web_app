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
@Table(name = "speakings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Speaking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    
    private String level; // easy, medium, hard
    
    private Double indicatorValue;
    
    @ElementCollection
    @CollectionTable(name = "speaking_things_to_speak", joinColumns = @JoinColumn(name = "speaking_id"))
    @Column(name = "item", columnDefinition = "TEXT")
    private List<String> thingsToSpeak;
    
    @ElementCollection
    @CollectionTable(name = "speaking_vocabulary", joinColumns = @JoinColumn(name = "speaking_id"))
    @Column(name = "word", columnDefinition = "TEXT")
    private List<String> vocabulary;
    
    @Column(columnDefinition = "TEXT")
    private String answer;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}



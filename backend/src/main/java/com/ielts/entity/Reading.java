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
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "readings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Reading {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    
    private String level; // easy, medium, hard
    
    private Double indicatorValue;
    
    @ElementCollection
    @CollectionTable(name = "reading_initial_questions", joinColumns = @JoinColumn(name = "reading_id"))
    @Column(name = "question", columnDefinition = "TEXT")
    private List<String> initialQuestions;
    
    @ElementCollection
    @CollectionTable(name = "reading_ending_questions", joinColumns = @JoinColumn(name = "reading_id"))
    @Column(name = "question", columnDefinition = "TEXT")
    private List<String> endingQuestions;
    
    @Column(columnDefinition = "TEXT")
    private String paragraph;
    
    @ElementCollection
    @CollectionTable(name = "reading_answers", joinColumns = @JoinColumn(name = "reading_id"))
    @Column(name = "answer", columnDefinition = "TEXT")
    private List<String> answers;
    
    private String initialQuestionNumbers;
    
    private String endingQuestionNumbers;
    
    @Column(columnDefinition = "TEXT")
    private String whatToDo;
    
    private Boolean extraData = false;
    
    @Column(columnDefinition = "TEXT")
    private String summary;
    
    @Enumerated(EnumType.STRING)
    private ReadingType type; // SENTENCE, TRUE_OR_FALSE, HEADING_COMPLETION, etc.
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "reading", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @OrderBy("questionOrder ASC")
    private List<ReadingQuestion> mcqQuestions; // For MCQS type readings
    
    public enum ReadingType {
        SENTENCE,
        TRUE_OR_FALSE,
        HEADING_COMPLETION,
        SUMMARY_COMPLETION,
        PARAGRAPH_COMPLETION,
        MCQS,
        LIST_SELECTION,
        TITLE_SELECTION,
        CATEGORIZATION,
        ENDING_SELECTION,
        SAQS
    }
}



package com.ielts.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "reading_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReadingQuestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reading_id", nullable = false)
    @JsonIgnore
    private Reading reading;
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;
    
    @ElementCollection
    @CollectionTable(name = "reading_question_options", joinColumns = @JoinColumn(name = "reading_question_id"))
    @Column(name = "option_text", columnDefinition = "TEXT")
    @OrderColumn(name = "option_order")
    private List<String> options; // A, B, C, D options
    
    @Column(columnDefinition = "TEXT", nullable = false)
    private String correctAnswer; // The correct option (A, B, C, or D)
    
    private Integer questionOrder; // Order of the question (1, 2, 3, 4...)
    
    private Boolean isInitialQuestion = true; // true for initial questions, false for ending questions
}


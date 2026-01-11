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
@Table(name = "listenings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Listening {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    
    private String level; // easy, medium, hard
    
    private Double indicatorValue;
    
    // Section 1
    @Column(columnDefinition = "TEXT")
    private String whatToDo;
    
    private String firstSectionAudio; // URL or path
    
    private String firstQuestionImage; // URL or path
    
    @ElementCollection
    @CollectionTable(name = "listening_s1_sub_questions1", joinColumns = @JoinColumn(name = "listening_id"))
    @Column(name = "question", columnDefinition = "TEXT")
    private List<String> s1SubQuestions1;
    
    private Boolean s1SubQuestions1Bool = false;
    
    private String s1SubQuestions1Numbers;
    
    private String initialQuestionNumbers;
    
    private Boolean s1SubQuestions2Bool = false;
    
    private String s1SubQuestions2Numbers;
    
    @ElementCollection
    @CollectionTable(name = "listening_s1_sub_questions2", joinColumns = @JoinColumn(name = "listening_id"))
    @Column(name = "question", columnDefinition = "TEXT")
    private List<String> s1SubQuestions2;
    
    private String secondQuestionImage;
    
    private Boolean secondQuestionImageBool = false;
    
    @ElementCollection
    @CollectionTable(name = "listening_s1_answers", joinColumns = @JoinColumn(name = "listening_id"))
    @Column(name = "answer", columnDefinition = "TEXT")
    private List<String> answers;
    
    // Section 2
    @Column(columnDefinition = "TEXT")
    private String s2WhatToDo;
    
    private String section2Audio;
    
    private String section2Image1;
    
    private Boolean section2Image1Bool = false;
    
    private String section2Image2;
    
    private Boolean section2Image2Bool = false;
    
    private String s2SubQuestion1Numbers;
    
    @ElementCollection
    @CollectionTable(name = "listening_s2_sub_questions1", joinColumns = @JoinColumn(name = "listening_id"))
    @Column(name = "question", columnDefinition = "TEXT")
    private List<String> s2SubQuestions1;
    
    private Boolean s2SubQuestions1Bool = false;
    
    private String s2SubQuestion2Numbers;
    
    @ElementCollection
    @CollectionTable(name = "listening_s2_sub_questions2", joinColumns = @JoinColumn(name = "listening_id"))
    @Column(name = "question", columnDefinition = "TEXT")
    private List<String> s2SubQuestions2;
    
    private Boolean s2SubQuestions2Bool = false;
    
    @ElementCollection
    @CollectionTable(name = "listening_s2_answers", joinColumns = @JoinColumn(name = "listening_id"))
    @Column(name = "answer", columnDefinition = "TEXT")
    private List<String> section2Answers;
    
    // Section 3
    @Column(columnDefinition = "TEXT")
    private String s3WhatToDo;
    
    private String section3Audio;
    
    private Boolean section3Image1Bool = false;
    
    private String section3Image1;
    
    private Boolean section3Image2Bool = false;
    
    private String section3Image2;
    
    private Boolean section3Image3Bool = false;
    
    private String section3Image3;
    
    @ElementCollection
    @CollectionTable(name = "listening_s3_questions1", joinColumns = @JoinColumn(name = "listening_id"))
    @Column(name = "question", columnDefinition = "TEXT")
    private List<String> section3Question1;
    
    private Boolean section3Question1Bool = false;
    
    private String section3Question1Numbers;
    
    @ElementCollection
    @CollectionTable(name = "listening_s3_questions2", joinColumns = @JoinColumn(name = "listening_id"))
    @Column(name = "question", columnDefinition = "TEXT")
    private List<String> section3Question2;
    
    private Boolean section3Questions2Bool = false;
    
    private String section3Question2Numbers;
    
    @ElementCollection
    @CollectionTable(name = "listening_s3_questions3", joinColumns = @JoinColumn(name = "listening_id"))
    @Column(name = "question", columnDefinition = "TEXT")
    private List<String> section3Question3;
    
    private Boolean section3Question3Bool = false;
    
    private String section3Question3Numbers;
    
    @ElementCollection
    @CollectionTable(name = "listening_s3_answers", joinColumns = @JoinColumn(name = "listening_id"))
    @Column(name = "answer", columnDefinition = "TEXT")
    private List<String> section3Answers;
    
    // Section 4
    @Column(columnDefinition = "TEXT")
    private String s4WhatToDo;
    
    private String section4Audio;
    
    private String section4Question1Numbers;
    
    private String section4Image1;
    
    private Boolean section4Image1Bool = false;
    
    private String section4Image2;
    
    private Boolean section4Image2Bool = false;
    
    @ElementCollection
    @CollectionTable(name = "listening_s4_questions1", joinColumns = @JoinColumn(name = "listening_id"))
    @Column(name = "question", columnDefinition = "TEXT")
    private List<String> section4Question1;
    
    private Boolean section4Question1Bool = false;
    
    private String section4Question2Numbers;
    
    @ElementCollection
    @CollectionTable(name = "listening_s4_questions2", joinColumns = @JoinColumn(name = "listening_id"))
    @Column(name = "question", columnDefinition = "TEXT")
    private List<String> section4Question2;
    
    private Boolean section4Question2Bool = false;
    
    private String section4Question3Numbers;
    
    @ElementCollection
    @CollectionTable(name = "listening_s4_questions3", joinColumns = @JoinColumn(name = "listening_id"))
    @Column(name = "question", columnDefinition = "TEXT")
    private List<String> section4Question3;
    
    private Boolean section4Question3Bool = false;
    
    @ElementCollection
    @CollectionTable(name = "listening_s4_answers", joinColumns = @JoinColumn(name = "listening_id"))
    @Column(name = "answer", columnDefinition = "TEXT")
    private List<String> section4Answers;
    
    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @LastModifiedDate
    private LocalDateTime updatedAt;
}



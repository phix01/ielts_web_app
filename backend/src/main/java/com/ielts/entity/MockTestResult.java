package com.ielts.entity;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "mock_test_results")
@EntityListeners(AuditingEntityListener.class)
public class MockTestResult {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDateTime takenAt;

    private double readingBand;
    private double listeningBand;
    private double writingBand;
    private double speakingBand;
    private double overallBand;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public MockTestResult() {}

    public MockTestResult(User user, LocalDateTime takenAt, double readingBand, double listeningBand, double writingBand, double speakingBand, double overallBand) {
        this.user = user;
        this.takenAt = takenAt;
        this.readingBand = readingBand;
        this.listeningBand = listeningBand;
        this.writingBand = writingBand;
        this.speakingBand = speakingBand;
        this.overallBand = overallBand;
    }

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public LocalDateTime getTakenAt() { return takenAt; }
    public void setTakenAt(LocalDateTime takenAt) { this.takenAt = takenAt; }
    public double getReadingBand() { return readingBand; }
    public void setReadingBand(double readingBand) { this.readingBand = readingBand; }
    public double getListeningBand() { return listeningBand; }
    public void setListeningBand(double listeningBand) { this.listeningBand = listeningBand; }
    public double getWritingBand() { return writingBand; }
    public void setWritingBand(double writingBand) { this.writingBand = writingBand; }
    public double getSpeakingBand() { return speakingBand; }
    public void setSpeakingBand(double speakingBand) { this.speakingBand = speakingBand; }
    public double getOverallBand() { return overallBand; }
    public void setOverallBand(double overallBand) { this.overallBand = overallBand; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
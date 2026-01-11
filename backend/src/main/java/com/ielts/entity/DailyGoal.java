package com.ielts.entity;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "daily_goals", uniqueConstraints = {@UniqueConstraint(columnNames = {"user_id", "date"})})
@EntityListeners(AuditingEntityListener.class)
public class DailyGoal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    private LocalDate date;

    private int readingMinutesTarget;
    private int listeningMinutesTarget;
    private int writingTasksTarget;
    private int vocabularyTarget;

    private boolean completed = false;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public DailyGoal() {}

    public DailyGoal(User user, LocalDate date) {
        this.user = user;
        this.date = date;
    }

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public int getReadingMinutesTarget() { return readingMinutesTarget; }
    public void setReadingMinutesTarget(int readingMinutesTarget) { this.readingMinutesTarget = readingMinutesTarget; }
    public int getListeningMinutesTarget() { return listeningMinutesTarget; }
    public void setListeningMinutesTarget(int listeningMinutesTarget) { this.listeningMinutesTarget = listeningMinutesTarget; }
    public int getWritingTasksTarget() { return writingTasksTarget; }
    public void setWritingTasksTarget(int writingTasksTarget) { this.writingTasksTarget = writingTasksTarget; }
    public int getVocabularyTarget() { return vocabularyTarget; }
    public void setVocabularyTarget(int vocabularyTarget) { this.vocabularyTarget = vocabularyTarget; }
    public boolean isCompleted() { return completed; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}

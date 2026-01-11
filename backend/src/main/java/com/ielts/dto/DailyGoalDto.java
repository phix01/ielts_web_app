package com.ielts.dto;

import java.time.LocalDate;

public class DailyGoalDto {
    public Long id;
    public LocalDate date;
    public int readingMinutesTarget;
    public int listeningMinutesTarget;
    public int writingTasksTarget;
    public int vocabularyTarget;
    public boolean completed;

    public DailyGoalDto() {}

    public DailyGoalDto(Long id, LocalDate date, int readingMinutesTarget, int listeningMinutesTarget, int writingTasksTarget, int vocabularyTarget, boolean completed) {
        this.id = id;
        this.date = date;
        this.readingMinutesTarget = readingMinutesTarget;
        this.listeningMinutesTarget = listeningMinutesTarget;
        this.writingTasksTarget = writingTasksTarget;
        this.vocabularyTarget = vocabularyTarget;
        this.completed = completed;
    }
}

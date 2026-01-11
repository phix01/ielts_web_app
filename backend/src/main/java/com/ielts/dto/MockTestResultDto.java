package com.ielts.dto;

import java.time.LocalDateTime;

public class MockTestResultDto {
    public Long id;
    public LocalDateTime takenAt;
    public double readingBand;
    public double listeningBand;
    public double writingBand;
    public double speakingBand;
    public double overallBand;

    public MockTestResultDto() {}

    public MockTestResultDto(Long id, LocalDateTime takenAt, double readingBand, double listeningBand, double writingBand, double speakingBand, double overallBand) {
        this.id = id;
        this.takenAt = takenAt;
        this.readingBand = readingBand;
        this.listeningBand = listeningBand;
        this.writingBand = writingBand;
        this.speakingBand = speakingBand;
        this.overallBand = overallBand;
    }
}

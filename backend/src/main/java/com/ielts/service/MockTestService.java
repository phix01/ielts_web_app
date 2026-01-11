package com.ielts.service;

import com.ielts.dto.MockTestResultDto;
import com.ielts.entity.MockTestResult;
import com.ielts.entity.User;
import com.ielts.repository.MockTestResultRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MockTestService {

    @Autowired
    private MockTestResultRepository mockTestResultRepository;

    public List<MockTestResultDto> listForUser(User user) {
        List<MockTestResult> list = mockTestResultRepository.findByUserOrderByTakenAtDesc(user);
        return list.stream().map(r -> new MockTestResultDto(r.getId(), r.getTakenAt(), r.getReadingBand(), r.getListeningBand(), r.getWritingBand(), r.getSpeakingBand(), r.getOverallBand())).collect(Collectors.toList());
    }

    public MockTestResultDto createForUser(User user, MockTestResultDto dto) {
        // Validate bands 0.0 - 9.0
        if (!valid(dto.readingBand) || !valid(dto.listeningBand) || !valid(dto.writingBand) || !valid(dto.speakingBand)) {
            throw new IllegalArgumentException("Bands must be between 0.0 and 9.0");
        }
        double overall = dto.overallBand > 0 ? dto.overallBand : Math.round(((dto.readingBand + dto.listeningBand + dto.writingBand + dto.speakingBand) / 4.0) * 10.0) / 10.0;
        MockTestResult r = new MockTestResult(user, dto.takenAt == null ? LocalDateTime.now() : dto.takenAt, dto.readingBand, dto.listeningBand, dto.writingBand, dto.speakingBand, overall);
        MockTestResult saved = mockTestResultRepository.save(r);
        return new MockTestResultDto(saved.getId(), saved.getTakenAt(), saved.getReadingBand(), saved.getListeningBand(), saved.getWritingBand(), saved.getSpeakingBand(), saved.getOverallBand());
    }

    public void deleteById(User user, Long id) {
        mockTestResultRepository.findById(id).ifPresent(r -> {
            if (r.getUser().getId().equals(user.getId())) mockTestResultRepository.delete(r);
            else throw new SecurityException("Not owner");
        });
    }

    public long countByUser(User user) {
        return mockTestResultRepository.countByUser(user);
    }

    private boolean valid(double b) {
        return b >= 0.0 && b <= 9.0;
    }
}

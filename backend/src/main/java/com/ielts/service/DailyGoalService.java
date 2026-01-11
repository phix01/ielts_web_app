package com.ielts.service;

import com.ielts.dto.DailyGoalDto;
import com.ielts.entity.DailyGoal;
import com.ielts.entity.User;
import com.ielts.repository.DailyGoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class DailyGoalService {

    @Autowired
    private DailyGoalRepository dailyGoalRepository;

    public DailyGoalDto getTodayGoalForUser(User user) {
        LocalDate today = LocalDate.now();
        Optional<DailyGoal> opt = dailyGoalRepository.findByUserAndDate(user, today);
        DailyGoal g = opt.orElseGet(() -> {
            DailyGoal d = new DailyGoal(user, today);
            d.setReadingMinutesTarget(20);
            d.setListeningMinutesTarget(15);
            d.setWritingTasksTarget(1);
            d.setVocabularyTarget(10);
            dailyGoalRepository.save(d);
            return d;
        });

        return map(g);
    }

    public DailyGoalDto updateTodayGoal(User user, DailyGoalDto dto) {
        LocalDate today = LocalDate.now();
        DailyGoal g = dailyGoalRepository.findByUserAndDate(user, today).orElseGet(() -> new DailyGoal(user, today));
        g.setReadingMinutesTarget(dto.readingMinutesTarget);
        g.setListeningMinutesTarget(dto.listeningMinutesTarget);
        g.setWritingTasksTarget(dto.writingTasksTarget);
        g.setVocabularyTarget(dto.vocabularyTarget);
        g.setCompleted(dto.completed);
        DailyGoal saved = dailyGoalRepository.save(g);
        return map(saved);
    }

    private DailyGoalDto map(DailyGoal g) {
        return new DailyGoalDto(g.getId(), g.getDate(), g.getReadingMinutesTarget(), g.getListeningMinutesTarget(), g.getWritingTasksTarget(), g.getVocabularyTarget(), g.isCompleted());
    }

    public long countCompletedGoals(User user) {
        return dailyGoalRepository.countByUserAndCompletedTrue(user);
    }
}

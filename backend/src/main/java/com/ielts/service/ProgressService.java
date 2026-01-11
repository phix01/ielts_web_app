package com.ielts.service;

import com.ielts.entity.Progress;
import com.ielts.entity.UserStats;
import com.ielts.repository.UserStatsRepository;
import com.ielts.entity.User;
import com.ielts.repository.ProgressRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

@Service
public class ProgressService {

    @Autowired
    private ProgressRepository progressRepository;

    @Autowired
    private UserStatsRepository userStatsRepository;

    @Transactional
    public void increment(User user, Progress.ContentType type) {
        Progress p = progressRepository.findByUserAndContentType(user, type)
                .orElseGet(() -> {
                    Progress np = new Progress();
                    np.setUser(user);
                    np.setContentType(type);
                    np.setCompletedCount(0);
                    return np;
                });

        p.setCompletedCount(p.getCompletedCount() + 1);
        progressRepository.save(p);
        // update streak: only increment once per day
        try {
            java.time.LocalDate today = java.time.LocalDate.now();
            UserStats stats = userStatsRepository.findByUser(user).orElseGet(() -> {
                UserStats s = new UserStats();
                s.setUser(user);
                s.setStreak(0);
                s.setLastActivityDate(null);
                return s;
            });

            java.time.LocalDate last = stats.getLastActivityDate();
            if (last == null || !last.equals(today)) {
                // if last activity was yesterday, increment; otherwise reset to 1
                if (last != null && last.equals(today.minusDays(1))) {
                    stats.setStreak(stats.getStreak() + 1);
                } else {
                    stats.setStreak(1);
                }
                stats.setLastActivityDate(today);
                userStatsRepository.save(stats);
            }
        } catch (Exception e) {
            // don't block progress on stats errors
            System.err.println("Failed to update user streak: " + e.getMessage());
        }
    }

    public Map<String, Integer> summary(User user) {
        List<Progress> list = progressRepository.findByUser(user);
        Map<String, Integer> map = new java.util.HashMap<>();
        // initialize
        for (Progress.ContentType t : Progress.ContentType.values()) map.put(t.name(), 0);
        for (Progress p : list) {
            map.put(p.getContentType().name(), p.getCompletedCount());
        }
        // add streak
        try {
            UserStats stats = userStatsRepository.findByUser(user).orElse(null);
            map.put("STREAK", stats != null ? stats.getStreak() : 0);
        } catch (Exception e) {
            map.put("STREAK", 0);
        }
        return map;
    }

    /**
     * Minimal dashboard stats as required by frontend.
     * completedExercises: sum of completedCount across all content types
     * practiceTimeHours: completedExercises * 0.5
     * vocabularyWords: completedExercises * 8
     * testsCompleted: 0 (no test tracking yet)
     */
    public java.util.Map<String, Object> dashboardStats(User user) {
        Map<String, Integer> sums = summary(user);
        int completedExercises = 0;
        for (Progress.ContentType t : Progress.ContentType.values()) {
            completedExercises += sums.getOrDefault(t.name(), 0);
        }
        double practiceTimeHours = completedExercises * 0.5; // assume 30 minutes per exercise
        int vocabularyWords = completedExercises * 8; // estimate 8 new words per exercise

        int dayStreak = 0;
        try {
            com.ielts.entity.UserStats stats = userStatsRepository.findByUser(user).orElse(null);
            dayStreak = stats != null ? stats.getStreak() : 0;
        } catch (Exception e) {
            dayStreak = 0;
        }

        java.util.Map<String, Object> out = new java.util.HashMap<>();
        out.put("exercisesCompleted", completedExercises);
        out.put("hoursPracticed", Math.round(practiceTimeHours * 10.0) / 10.0); // one decimal place
        out.put("vocabularyWords", vocabularyWords);
        out.put("dayStreak", dayStreak);
        return out;
    }
}

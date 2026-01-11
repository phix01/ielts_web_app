package com.ielts.service;

import com.ielts.dto.LeaderboardEntry;
import com.ielts.entity.MockTestResult;
import com.ielts.entity.User;
import com.ielts.repository.DailyGoalRepository;
import com.ielts.repository.MockTestResultRepository;
import com.ielts.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LeaderboardService {

    @Autowired(required = false)
    private MockTestResultRepository mockTestResultRepository;

    @Autowired(required = false)
    private DailyGoalRepository dailyGoalRepository;

    @Autowired
    private UserRepository userRepository;

    private final List<LeaderboardEntry> staticEntries = new ArrayList<>();

    @PostConstruct
    public void init() {
        // Keep some demo static entries in case no user data
        staticEntries.add(new LeaderboardEntry("alice", 150));
        staticEntries.add(new LeaderboardEntry("bob", 120));
        staticEntries.add(new LeaderboardEntry("carol", 90));
        staticEntries.add(new LeaderboardEntry("dave", 80));
    }

    public List<LeaderboardEntry> topEntries() {
        try {
            // If we have repositories, compute points from user data
            if (mockTestResultRepository != null && dailyGoalRepository != null) {
                List<User> users = userRepository.findAll();
                Map<String, Integer> points = new HashMap<>();
                for (User u : users) {
                    int mockCount = (int) mockTestResultRepository.countByUser(u);
                    int completedGoals = (int) dailyGoalRepository.countByUserAndCompletedTrue(u);
                    int pts = mockCount * 10 + completedGoals * 5;
                    if (pts > 0) points.put(u.getFirstName() == null ? u.getEmail() : u.getFirstName(), pts);
                }
                // convert and sort
                List<LeaderboardEntry> list = points.entrySet().stream().map(e -> new LeaderboardEntry(e.getKey(), e.getValue())).sorted(Comparator.comparingInt(LeaderboardEntry::getPoints).reversed()).collect(Collectors.toList());
                if (!list.isEmpty()) return list.stream().limit(10).collect(Collectors.toList());
            }
        } catch (Exception ignored) {
            // best-effort: fall back to static
        }

        staticEntries.sort(Comparator.comparingInt(LeaderboardEntry::getPoints).reversed());
        return staticEntries.stream().limit(10).collect(Collectors.toList());
    }
}

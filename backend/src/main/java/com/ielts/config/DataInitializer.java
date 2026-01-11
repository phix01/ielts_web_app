package com.ielts.config;

import com.ielts.entity.StudyRoom;
import com.ielts.repository.StudyRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired(required = false)
    private StudyRoomRepository studyRoomRepository;

    @Autowired(required = false)
    private com.ielts.repository.MockTestResultRepository mockTestResultRepository;

    @Autowired(required = false)
    private com.ielts.repository.DailyGoalRepository dailyGoalRepository;

    @Autowired(required = false)
    private com.ielts.repository.UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // No-op: books are now served from classpath resources in /books

        // Seed demo StudyRooms if repository available
        try {
            if (studyRoomRepository != null && studyRoomRepository.count() == 0) {
                studyRoomRepository.save(new StudyRoom("General IELTS Discussion", 12));
                studyRoomRepository.save(new StudyRoom("Listening Practice Room", 8));
                studyRoomRepository.save(new StudyRoom("Reading Tips", 5));
            }
        } catch (Exception ignored) {
            // best-effort seeding only
        }

        // Seed a couple of demo mock test results for first users (best-effort)
        try {
            if (mockTestResultRepository != null && userRepository != null) {
                if (mockTestResultRepository.count() == 0) {
                    userRepository.findAll().stream().limit(2).forEach(u -> {
                        mockTestResultRepository.save(new com.ielts.entity.MockTestResult(u, java.time.LocalDateTime.now().minusDays(3), 6.5,6.0,6.0,6.0,6.1));
                        mockTestResultRepository.save(new com.ielts.entity.MockTestResult(u, java.time.LocalDateTime.now().minusDays(10), 6.0,5.5,5.5,5.5,5.6));
                    });
                }
            }
        } catch (Exception ignored) {}

        // Seed a completed daily goal for demo purposes if possible
        try {
            if (dailyGoalRepository != null && userRepository != null) {
                if (dailyGoalRepository.count() == 0) {
                    userRepository.findAll().stream().limit(1).forEach(u -> {
                        com.ielts.entity.DailyGoal g = new com.ielts.entity.DailyGoal(u, java.time.LocalDate.now().minusDays(1));
                        g.setReadingMinutesTarget(30);
                        g.setCompleted(true);
                        dailyGoalRepository.save(g);
                    });
                }
            }
        } catch (Exception ignored) {}
    }
}

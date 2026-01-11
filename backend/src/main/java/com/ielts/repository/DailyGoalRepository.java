package com.ielts.repository;

import com.ielts.entity.DailyGoal;
import com.ielts.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DailyGoalRepository extends JpaRepository<DailyGoal, Long> {
    Optional<DailyGoal> findByUserAndDate(User user, LocalDate date);
    long countByUserAndCompletedTrue(User user);
}

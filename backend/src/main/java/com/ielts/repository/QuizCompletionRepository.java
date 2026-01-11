package com.ielts.repository;

import com.ielts.entity.Quiz;
import com.ielts.entity.QuizCompletion;
import com.ielts.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizCompletionRepository extends JpaRepository<QuizCompletion, Long> {
    Optional<QuizCompletion> findByUserAndQuiz(User user, Quiz quiz);
    List<QuizCompletion> findByUser(User user);
    boolean existsByUserAndQuiz(User user, Quiz quiz);
}



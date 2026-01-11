package com.ielts.repository;

import com.ielts.entity.MockTestResult;
import com.ielts.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MockTestResultRepository extends JpaRepository<MockTestResult, Long> {
    List<MockTestResult> findByUserOrderByTakenAtDesc(User user);
    long countByUser(User user);
}

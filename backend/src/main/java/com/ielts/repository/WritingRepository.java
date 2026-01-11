package com.ielts.repository;

import com.ielts.entity.Writing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WritingRepository extends JpaRepository<Writing, Long> {
    List<Writing> findByLevel(String level);
}



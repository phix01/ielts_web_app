package com.ielts.repository;

import com.ielts.entity.Reading;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReadingRepository extends JpaRepository<Reading, Long> {
    List<Reading> findByType(Reading.ReadingType type);
    List<Reading> findByLevel(String level);
    List<Reading> findByTypeAndLevel(Reading.ReadingType type, String level);
}



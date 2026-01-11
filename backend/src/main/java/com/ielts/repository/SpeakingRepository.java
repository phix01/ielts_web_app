package com.ielts.repository;

import com.ielts.entity.Speaking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SpeakingRepository extends JpaRepository<Speaking, Long> {
    List<Speaking> findByLevel(String level);
}



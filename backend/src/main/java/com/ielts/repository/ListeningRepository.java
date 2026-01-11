package com.ielts.repository;

import com.ielts.entity.Listening;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ListeningRepository extends JpaRepository<Listening, Long> {
    List<Listening> findByLevel(String level);
}



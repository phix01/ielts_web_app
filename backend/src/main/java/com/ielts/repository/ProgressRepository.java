package com.ielts.repository;

import com.ielts.entity.Progress;
import com.ielts.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    Optional<Progress> findByUserAndContentType(User user, Progress.ContentType contentType);
    List<Progress> findByUser(User user);
}

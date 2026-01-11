package com.ielts.repository;

import com.ielts.entity.PremiumUser;
import com.ielts.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PremiumUserRepository extends JpaRepository<PremiumUser, Long> {
    Optional<PremiumUser> findByUser(User user);
    boolean existsByUser(User user);
}



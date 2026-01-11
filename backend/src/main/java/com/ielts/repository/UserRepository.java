package com.ielts.repository;

import com.ielts.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUid(String uid);
    Optional<User> findByProviderId(String providerId);
    boolean existsByEmail(String email);
    boolean existsByUid(String uid);
}



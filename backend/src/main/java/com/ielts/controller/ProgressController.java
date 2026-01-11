package com.ielts.controller;

import com.ielts.entity.Progress;
import com.ielts.entity.User;
import com.ielts.repository.UserRepository;
import com.ielts.security.UserPrincipal;
import com.ielts.service.ProgressService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/progress")
@CrossOrigin(origins = "*")
public class ProgressController {

    @Autowired
    private ProgressService progressService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/complete")
    public ResponseEntity<?> complete(@RequestBody ProgressRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal)) {
            return ResponseEntity.status(401).build();
        }

        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        User user = userRepository.findByEmail(principal.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        try {
            Progress.ContentType type = Progress.ContentType.valueOf(request.getContentType().toUpperCase());
            progressService.increment(user, type);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid contentType");
        }
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Integer>> summary() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal)) {
            return ResponseEntity.status(401).build();
        }

        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        User user = userRepository.findByEmail(principal.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        Map<String, Integer> map = progressService.summary(user);
        return ResponseEntity.ok(map);
    }

    @GetMapping("/dashboard-stats")
    public ResponseEntity<java.util.Map<String, Object>> dashboardStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal)) {
            return ResponseEntity.status(401).build();
        }

        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        User user = userRepository.findByEmail(principal.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        java.util.Map<String, Object> stats = progressService.dashboardStats(user);
        return ResponseEntity.ok(stats);
    }

    @Data
    public static class ProgressRequest {
        private String contentType;
    }
}

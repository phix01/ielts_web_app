package com.ielts.controller;

import com.ielts.dto.DailyGoalDto;
import com.ielts.entity.User;
import com.ielts.repository.UserRepository;
import com.ielts.security.UserPrincipal;
import com.ielts.service.DailyGoalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/goals")
@CrossOrigin(origins = "*")
public class GoalsController {

    @Autowired
    private DailyGoalService dailyGoalService;

    @Autowired
    private UserRepository userRepository;

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal)) return null;
        UserPrincipal p = (UserPrincipal) auth.getPrincipal();
        Optional<User> u = userRepository.findById(p.getId());
        return u.orElse(null);
    }

    @GetMapping("/today")
    public ResponseEntity<DailyGoalDto> getToday() {
        User u = currentUser();
        if (u == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(dailyGoalService.getTodayGoalForUser(u));
    }

    @PutMapping("/today")
    public ResponseEntity<DailyGoalDto> updateToday(@RequestBody DailyGoalDto dto) {
        User u = currentUser();
        if (u == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(dailyGoalService.updateTodayGoal(u, dto));
    }
}

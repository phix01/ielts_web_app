package com.ielts.controller;

import com.ielts.dto.MockTestResultDto;
import com.ielts.entity.User;
import com.ielts.repository.UserRepository;
import com.ielts.security.UserPrincipal;
import com.ielts.service.MockTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;

@RestController
@RequestMapping("/mock-tests")
@CrossOrigin(origins = "*")
public class MockTestController {

    @Autowired
    private MockTestService mockTestService;

    @Autowired
    private UserRepository userRepository;

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal)) return null;
        UserPrincipal p = (UserPrincipal) auth.getPrincipal();
        Optional<User> u = userRepository.findById(p.getId());
        return u.orElse(null);
    }

    @GetMapping
    public ResponseEntity<?> list() {
        User u = currentUser();
        if (u == null) return ResponseEntity.status(401).build();
        return ResponseEntity.ok(mockTestService.listForUser(u));
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody MockTestResultDto dto) {
        User u = currentUser();
        if (u == null) return ResponseEntity.status(401).build();
        try {
            return ResponseEntity.ok(mockTestService.createForUser(u, dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        User u = currentUser();
        if (u == null) return ResponseEntity.status(401).build();
        try {
            mockTestService.deleteById(u, id);
            return ResponseEntity.ok().build();
        } catch (SecurityException se) {
            return ResponseEntity.status(403).build();
        }
    }
}

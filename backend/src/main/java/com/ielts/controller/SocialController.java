package com.ielts.controller;

import com.ielts.dto.LeaderboardEntry;
import com.ielts.dto.StudyRoomResponse;
import com.ielts.security.UserPrincipal;
import com.ielts.service.LeaderboardService;
import com.ielts.service.StudyRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping
@CrossOrigin(origins = "*")
public class SocialController {

    @Autowired
    private StudyRoomService studyRoomService;

    @Autowired
    private LeaderboardService leaderboardService;

    @GetMapping("/study-rooms")
    public ResponseEntity<List<StudyRoomResponse>> listStudyRooms() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal)) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(studyRoomService.listStudyRooms());
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardEntry>> leaderboard() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal)) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(leaderboardService.topEntries());
    }
}

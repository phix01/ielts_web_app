package com.ielts.controller;

import com.ielts.entity.NotificationSettings;
import com.ielts.entity.User;
import com.ielts.repository.UserRepository;
import com.ielts.security.UserPrincipal;
import com.ielts.service.NotificationService;
import lombok.Data;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/settings")
    public ResponseEntity<NotificationSettingsResponse> getSettings() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal)) {
            return ResponseEntity.status(401).build();
        }

        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        User user = userRepository.findByEmail(principal.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        NotificationSettings s = notificationService.getSettings(user);
        NotificationSettingsResponse resp = new NotificationSettingsResponse();
        resp.setPushNotificationsEnabled(s.getPushNotificationsEnabled());
        resp.setEmailUpdatesEnabled(s.getEmailUpdatesEnabled());
        return ResponseEntity.ok(resp);
    }

    @PutMapping("/settings")
    public ResponseEntity<NotificationSettingsResponse> updateSettings(@RequestBody NotificationSettingsRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal)) {
            return ResponseEntity.status(401).build();
        }

        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        User user = userRepository.findByEmail(principal.getUsername()).orElse(null);
        if (user == null) return ResponseEntity.status(401).build();

        NotificationSettings s = notificationService.updateSettings(user, request.getPushNotificationsEnabled(), request.getEmailUpdatesEnabled());
        NotificationSettingsResponse resp = new NotificationSettingsResponse();
        resp.setPushNotificationsEnabled(s.getPushNotificationsEnabled());
        resp.setEmailUpdatesEnabled(s.getEmailUpdatesEnabled());
        return ResponseEntity.ok(resp);
    }

    @Data
    public static class NotificationSettingsRequest {
        private Boolean pushNotificationsEnabled;
        private Boolean emailUpdatesEnabled;
    }

    @Data
    public static class NotificationSettingsResponse {
        private Boolean pushNotificationsEnabled;
        private Boolean emailUpdatesEnabled;
    }
}

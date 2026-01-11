package com.ielts.controller;

import com.ielts.dto.FaqItem;
import com.ielts.service.HelpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.List;

@RestController
@RequestMapping("/help")
@CrossOrigin(origins = "*")
public class HelpController {

    @Autowired
    private HelpService helpService;

    @GetMapping("/faq")
    public ResponseEntity<List<FaqItem>> faqs() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            // keep FAQs public to be helpful
            return ResponseEntity.ok(helpService.listFaqs());
        }
        return ResponseEntity.ok(helpService.listFaqs());
    }

    @PostMapping("/ask")
    public ResponseEntity<?> ask(@RequestBody(required = false) java.util.Map<String,String> body) {
        String msg = body == null ? "" : body.getOrDefault("message", "");
        if (msg == null || msg.trim().isEmpty()) return ResponseEntity.badRequest().body("message required");
        String reply = helpService.findAnswer(msg.trim());
        return ResponseEntity.ok(java.util.Map.of("reply", reply));
    }
}

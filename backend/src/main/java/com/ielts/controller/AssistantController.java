package com.ielts.controller;

import com.ielts.dto.AssistantChatRequest;
import com.ielts.dto.AssistantChatResponse;
import com.ielts.security.UserPrincipal;
import com.ielts.service.AssistantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/assistant")
@CrossOrigin(origins = "*")
public class AssistantController {

    @Autowired
    private AssistantService assistantService;

    @GetMapping("/status")
    public ResponseEntity<Object> status() {
        boolean cfg = assistantService.isConfigured();
        Map<String, Object> body = new java.util.HashMap<>();
        body.put("configured", cfg);
        body.put("message", cfg ? "Assistant configured" : "Assistant not configured; set HF_API_KEY to enable");
        return ResponseEntity.ok(body);
    }

    @PostMapping("/chat")
    public ResponseEntity<AssistantChatResponse> chat(@RequestBody AssistantChatRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof UserPrincipal)) {
            // Keep previous behavior: return 401 for missing/invalid principal
            return ResponseEntity.status(401).build();
        }

        String msg = req.getMessage() == null ? "" : req.getMessage().trim();
        if (msg.isEmpty()) return ResponseEntity.badRequest().build();

        try {
            String reply = assistantService.chat(msg);
            return ResponseEntity.ok(new AssistantChatResponse(reply));
        } catch (IllegalStateException ise) {
            // Configuration missing
            org.slf4j.LoggerFactory.getLogger(AssistantController.class)
                    .warn("Assistant called but not configured: {}", ise.getMessage());
            return ResponseEntity.status(503).body(new AssistantChatResponse("Assistant not available - server not configured."));
        } catch (RuntimeException re) {
            org.slf4j.LoggerFactory.getLogger(AssistantController.class)
                    .error("Assistant failure: {}", re.getMessage(), re);
            return ResponseEntity.status(500).body(new AssistantChatResponse("Assistant failed to process the request."));
        } catch (Exception e) {
            org.slf4j.LoggerFactory.getLogger(AssistantController.class)
                    .error("Unexpected assistant error: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(new AssistantChatResponse("Assistant failed to respond."));
        }
    }
}

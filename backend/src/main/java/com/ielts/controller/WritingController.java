package com.ielts.controller;

import com.ielts.entity.Writing;
import com.ielts.service.WritingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/writings")
@CrossOrigin(origins = "*")
public class WritingController {
    
    @Autowired
    private WritingService writingService;
    
    @GetMapping
    public ResponseEntity<List<Writing>> getAllWritings() {
        return ResponseEntity.ok(writingService.getAllWritings());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Writing> getWritingById(@PathVariable Long id) {
        return writingService.getWritingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/level/{level}")
    public ResponseEntity<List<Writing>> getWritingsByLevel(@PathVariable String level) {
        return ResponseEntity.ok(writingService.getWritingsByLevel(level));
    }
}



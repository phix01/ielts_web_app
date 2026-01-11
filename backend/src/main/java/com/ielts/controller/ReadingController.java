package com.ielts.controller;

import com.ielts.entity.Reading;
import com.ielts.service.ReadingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/readings")
@CrossOrigin(origins = "*")
public class ReadingController {
    
    @Autowired
    private ReadingService readingService;
    
    @GetMapping("/type/{type}")
    public ResponseEntity<List<Reading>> getReadingsByType(@PathVariable String type) {
        try {
            Reading.ReadingType readingType = Reading.ReadingType.valueOf(type.toUpperCase());
            return ResponseEntity.ok(readingService.getReadingsByType(readingType));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Reading> getReadingById(@PathVariable Long id) {
        return readingService.getReadingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/level/{level}")
    public ResponseEntity<List<Reading>> getReadingsByLevel(@PathVariable String level) {
        return ResponseEntity.ok(readingService.getReadingsByLevel(level));
    }
}



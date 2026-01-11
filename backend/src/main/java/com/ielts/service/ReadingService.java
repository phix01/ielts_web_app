package com.ielts.service;

import com.ielts.entity.Reading;
import com.ielts.repository.ReadingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReadingService {
    
    @Autowired
    private ReadingRepository readingRepository;
    
    public List<Reading> getReadingsByType(Reading.ReadingType type) {
        return readingRepository.findByType(type);
    }
    
    public Optional<Reading> getReadingById(Long id) {
        return readingRepository.findById(id);
    }
    
    public List<Reading> getReadingsByLevel(String level) {
        return readingRepository.findByLevel(level);
    }
}



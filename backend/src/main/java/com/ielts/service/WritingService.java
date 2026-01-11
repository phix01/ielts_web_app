package com.ielts.service;

import com.ielts.entity.Writing;
import com.ielts.repository.WritingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class WritingService {
    
    @Autowired
    private WritingRepository writingRepository;
    
    public List<Writing> getAllWritings() {
        return writingRepository.findAll();
    }
    
    public Optional<Writing> getWritingById(Long id) {
        return writingRepository.findById(id);
    }
    
    public List<Writing> getWritingsByLevel(String level) {
        return writingRepository.findByLevel(level);
    }
}



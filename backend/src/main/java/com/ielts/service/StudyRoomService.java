package com.ielts.service;

import com.ielts.dto.StudyRoomResponse;
import com.ielts.entity.StudyRoom;
import com.ielts.repository.StudyRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudyRoomService {

    @Autowired
    private StudyRoomRepository studyRoomRepository;

    public List<StudyRoomResponse> listStudyRooms() {
        List<StudyRoom> rooms = studyRoomRepository.findAll();
        return rooms.stream().map(r -> new StudyRoomResponse(r.getId(), r.getName(), r.getParticipantCount())).collect(Collectors.toList());
    }
}

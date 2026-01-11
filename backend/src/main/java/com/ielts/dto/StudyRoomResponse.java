package com.ielts.dto;

public class StudyRoomResponse {
    private Long id;
    private String name;
    private int participantCount;

    public StudyRoomResponse() {}

    public StudyRoomResponse(Long id, String name, int participantCount) {
        this.id = id;
        this.name = name;
        this.participantCount = participantCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getParticipantCount() { return participantCount; }
    public void setParticipantCount(int participantCount) { this.participantCount = participantCount; }
}

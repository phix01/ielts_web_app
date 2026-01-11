package com.ielts.dto;

public class AssistantChatRequest {
    private String message;

    public AssistantChatRequest() {}

    public AssistantChatRequest(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

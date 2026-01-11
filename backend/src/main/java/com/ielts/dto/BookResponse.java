package com.ielts.dto;

public class BookResponse {
    private String fileName;
    private String displayTitle;

    public BookResponse() {}

    public BookResponse(String fileName, String displayTitle) {
        this.fileName = fileName;
        this.displayTitle = displayTitle;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getDisplayTitle() {
        return displayTitle;
    }

    public void setDisplayTitle(String displayTitle) {
        this.displayTitle = displayTitle;
    }
}

package com.ielts.dto;

import java.util.List;

public class FaqItem {
    public String question;
    public String answer;
    public List<String> keywords;

    public FaqItem() {}

    public FaqItem(String question, String answer, List<String> keywords) {
        this.question = question;
        this.answer = answer;
        this.keywords = keywords;
    }
}

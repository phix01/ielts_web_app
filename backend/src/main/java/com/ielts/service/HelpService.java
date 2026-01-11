package com.ielts.service;

import com.ielts.dto.FaqItem;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Service
public class HelpService {
    private final List<FaqItem> faqs = new ArrayList<>();

    @PostConstruct
    public void init() {
        faqs.add(new FaqItem("How do I start a test?", "Go to Tests in the sidebar, choose a test and click Start.", List.of("start","test","tests","begin")));
        faqs.add(new FaqItem("How do I view my notes?", "Open Notes from the sidebar to view and edit your notes.", List.of("notes","view notes","my notes")));
        faqs.add(new FaqItem("How to use Books?", "Open Books from the sidebar and click a title to read PDFs fullscreen.", List.of("books","pdf","reader")));
        faqs.add(new FaqItem("What is Study Rooms?", "Study Rooms are demo rooms for discussion — read-only in this demo.", List.of("study","rooms","study rooms")));
        faqs.add(new FaqItem("How to add mock test results?", "Go to Mock Tests and fill the form to add a result.", List.of("mock","test","result","score")));
        faqs.add(new FaqItem("How to change my settings?", "Open Settings from the sidebar to update profile and preferences.", List.of("settings","profile","account")));
        faqs.add(new FaqItem("Can I use real-time chat?", "No — this demo does not support WebSocket or real-time features.", List.of("realtime","websocket","web rtc","webrtc")));
        faqs.add(new FaqItem("How is Leaderboard computed?", "Leaderboard is demo-only and may be based on mock tests and completed goals.", List.of("leaderboard","points","ranking")));
        faqs.add(new FaqItem("How to track daily goals?", "Open Dashboard and use Today's Plan card to set and complete your goals.", List.of("daily","goals","plan","today")));
        faqs.add(new FaqItem("How to delete a mock test?", "Open Mock Tests and click Delete on the entry you want to remove.", List.of("delete","remove","mock tests","mock test")));
    }

    public List<FaqItem> listFaqs() {
        return new ArrayList<>(faqs);
    }

    public String findAnswer(String message) {
        String lower = message == null ? "" : message.toLowerCase();
        for (FaqItem f : faqs) {
            for (String k : f.keywords) {
                if (lower.contains(k.toLowerCase())) return f.answer;
            }
        }
        // fallback
        return "Sorry, I don't know that. Try looking at the FAQs or the Dashboard features (Tests, Books, Mock Tests, Today's Plan).";
    }
}

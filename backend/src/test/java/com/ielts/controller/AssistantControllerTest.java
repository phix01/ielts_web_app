package com.ielts.controller;

import com.ielts.dto.AssistantChatRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AssistantControllerTest {

    @Autowired
    private MockMvc mvc;

    @Test
    public void chat_without_auth_returns_forbidden() throws Exception {
        mvc.perform(post("/assistant/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"message\":\"How do I use notes?\"}"))
                .andExpect(status().isForbidden());
    }
}

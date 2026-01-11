package com.ielts.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class NoteControllerTest {

    @Autowired
    private MockMvc mvc;

    @Test
    public void update_without_auth_returns_forbidden() throws Exception {
        mvc.perform(put("/notes/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"New title\", \"content\":\"x\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    public void delete_without_auth_returns_forbidden() throws Exception {
        mvc.perform(delete("/notes/1")).andExpect(status().isForbidden());
    }
}

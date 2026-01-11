package com.ielts.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class BookControllerTest {

    @Autowired
    private MockMvc mvc;

    @Test
    public void list_without_auth_returns_forbidden() throws Exception {
        mvc.perform(get("/books")).andExpect(status().isForbidden());
    }

    @Test
    public void pdf_without_auth_returns_forbidden() throws Exception {
        mvc.perform(get("/books/sample.pdf/pdf")).andExpect(status().isForbidden());
    }
}

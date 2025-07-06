package com.example.demo;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class DemoApplicationTests {

    @Autowired
    private MockMvc mvc;

    @Autowired
    private ObjectMapper mapper;

    @BeforeEach
    void reset() throws Exception {
        mvc.perform(post("/api/tasks/reset"))
           .andExpect(status().isNoContent());
    }

    @Test
    void testAddAndGetTasks() throws Exception {
        Task t1 = new Task(null, "Testaufgabe1", false);
        String json = mapper.writeValueAsString(t1);

        // POST /api/tasks
        mvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
           .andExpect(status().isOk())
           // ID ist nun gesetzt, prüfen wir nur description und done
           .andExpect(jsonPath("$.taskdescription").value("Testaufgabe1"))
           .andExpect(jsonPath("$.done").value(false));

        // GET /api/tasks
        mvc.perform(get("/api/tasks"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$[0].taskdescription").value("Testaufgabe1"))
           .andExpect(jsonPath("$[0].done").value(false));
    }

    @Test
    void testDeleteTask() throws Exception {
        // erst Aufgabe anlegen
        Task t2 = new Task(null, "ZuLoeschen", false);
        String response = mvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(t2)))
           .andExpect(status().isOk())
           .andReturn()
           .getResponse()
           .getContentAsString();

        Task created = mapper.readValue(response, Task.class);
        Long id = created.getId();

        // DELETE /api/tasks/{id}
        mvc.perform(delete("/api/tasks/{id}", id))
           .andExpect(status().isNoContent());

        // GET /api/tasks → Liste ist leer
        mvc.perform(get("/api/tasks"))
           .andExpect(status().isOk())
           .andExpect(jsonPath("$.length()").value(0));
    }
}

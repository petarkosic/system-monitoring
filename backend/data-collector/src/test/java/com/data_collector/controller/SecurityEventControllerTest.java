package com.data_collector.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.data_collector.model.SecurityEvent;
import com.data_collector.service.RabbitMQService;
import com.data_collector.service.SecurityEventService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(SecurityEventController.class)
class SecurityEventControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private RabbitMQService rabbitMQService;

    @MockitoBean
    private SecurityEventService securityEventService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void postSecurityEvent_savesAndPublishes() throws Exception {
        SecurityEvent req = new SecurityEvent();
        req.setEventId("ev1");
        SecurityEvent saved = new SecurityEvent();
        saved.setId("db");
        saved.setEventId("ev1");

        Mockito.when(securityEventService.saveSecurityEvent(any(SecurityEvent.class))).thenReturn(saved);

        mvc.perform(post("/api/security-events")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("db"));

        Mockito.verify(rabbitMQService).sendSecurityEventToQueue(saved);
    }

    @Test
    void getCriticalEvents_usesService() throws Exception {
        Mockito.when(securityEventService.getCriticalEvents()).thenReturn(List.of());
        mvc.perform(get("/api/security-events/critical"))
            .andExpect(status().isOk());
        Mockito.verify(securityEventService).getCriticalEvents();
    }
}

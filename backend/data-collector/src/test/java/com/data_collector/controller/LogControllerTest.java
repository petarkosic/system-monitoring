package com.data_collector.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.data_collector.model.LogEntry;
import com.data_collector.service.LogService;
import com.data_collector.service.RabbitMQService;
import com.fasterxml.jackson.databind.ObjectMapper;

@WebMvcTest(LogController.class)
class LogControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private RabbitMQService rabbitMQService;

    @MockitoBean
    private LogService logService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void postLog_savesAndPublishes() throws Exception {
        LogEntry req = new LogEntry();
        req.setLogId("l1");
        req.setMessage("m");
        req.setService("svc");
        LogEntry saved = new LogEntry();
        saved.setId("db-1");
        saved.setLogId("l1");
        saved.setMessage("m");
        saved.setService("svc");
        saved.setTimestamp(Instant.now());

        Mockito.when(logService.saveLog(any(LogEntry.class))).thenReturn(saved);

        mvc.perform(post("/api/logs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value("db-1"))
            .andExpect(jsonPath("$.service").value("svc"));

        Mockito.verify(rabbitMQService).sendLogToQueue(saved);
    }

    @Test
    void getLogsByService_returnsList() throws Exception {
        LogEntry e = new LogEntry();
        e.setService("auth");
        Mockito.when(logService.getLogsByService("auth")).thenReturn(List.of(e));

        mvc.perform(get("/api/logs/service/auth"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].service").value("auth"));
    }
}

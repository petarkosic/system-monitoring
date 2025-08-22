package com.alert_manager.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.alert_manager.model.Alert;
import com.alert_manager.service.AlertService;

@WebMvcTest(AlertController.class)
class AlertControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private AlertService alertService;

    @Test
    void getAllAlerts_returnsJsonArray() throws Exception {
        Alert a = new Alert();
        a.setId("1");
        a.setMessage("m");
        when(alertService.getAllAlerts()).thenReturn(List.of(a));

        mockMvc.perform(get("/api/alerts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value("1"))
                .andExpect(jsonPath("$[0].message").value("m"));
    }

    @Test
    void updateStatus_callsService_andReturnsUpdated() throws Exception {
        Alert updated = new Alert();
        updated.setId("1");
        updated.setStatus(Alert.AlertStatus.RESOLVED);

        when(alertService.updateAlertStatus("1", "RESOLVED")).thenReturn(updated);

        mockMvc.perform(patch("/api/alerts/1/status")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content("RESOLVED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("1"))
                .andExpect(jsonPath("$.status").value("RESOLVED"));
    }

    @Test
    void updateNote_callsService_andReturnsUpdated() throws Exception {
        Alert updated = new Alert();
        updated.setId("2");
        updated.setResolutionNotes("note");

        when(alertService.updateNote("2", "note")).thenReturn(updated);

        mockMvc.perform(patch("/api/alerts/2/note")
                        .contentType(MediaType.TEXT_PLAIN)
                        .content("note"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value("2"))
                .andExpect(jsonPath("$.resolutionNotes").value("note"));
    }
}

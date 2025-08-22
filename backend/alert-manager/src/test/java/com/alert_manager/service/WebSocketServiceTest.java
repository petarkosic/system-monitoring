package com.alert_manager.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;

import java.util.Date;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import com.alert_manager.dto.WebSocketAlertDto;
import com.alert_manager.model.Alert;

class WebSocketServiceTest {

    @Mock
    SimpMessagingTemplate messagingTemplate;

    WebSocketService webSocketService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        webSocketService = new WebSocketService(messagingTemplate);
    }

    @Test
    void sendAlert_buildsDtoAndSends() {
        Alert a = new Alert();
        a.setId("abc");
        a.setRuleType("RULE_X");
        a.setMessage("Something happened");
        a.setService("svc");
        a.setSeverity("low");
        a.setStatus(Alert.AlertStatus.OPEN);
        // set createdAt to a known date:
        a.setCreatedAt(new Date(0)); // epoch

        ArgumentCaptor<Object> captor = ArgumentCaptor.forClass(Object.class);

        webSocketService.sendAlert(a);

        verify(messagingTemplate).convertAndSend(eq("/topic/alerts"), captor.capture());

        Object payload = captor.getValue();
        assertTrue(payload instanceof WebSocketAlertDto);
        WebSocketAlertDto dto = (WebSocketAlertDto) payload;

        assertEquals("abc", dto.getId());
        assertEquals("RULE_X in svc", dto.getSummary());
        assertNotNull(dto.getTimestamp());
        // timestamp should represent epoch date in the configured format
        assertTrue(dto.getTimestamp().startsWith("1970-01-01"));
    }
}

package com.alert_manager.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.alert_manager.dto.AlertDto;
import com.alert_manager.model.Alert;
import com.alert_manager.repository.AlertRepository;

@ExtendWith(MockitoExtension.class)
class AlertServiceTest {

    @Mock
    private AlertRepository alertRepository;

    @Mock
    private WebSocketService webSocketService;

    @InjectMocks
    private AlertService alertService;

    @BeforeEach
    void setup() {
        // Mockito will inject mocks into alertService
    }

    @Test
    void handleAlert_savesAlertAndSendsToWebSocket() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("service", "auth");
        payload.put("severity", "high");

        AlertDto dto = new AlertDto();
        dto.setRuleType("CPU_HIGH");
        dto.setMessage("cpu above threshold");
        dto.setPayload(payload);

        // Simulate repository.save() assigning an id and returning saved alert
        when(alertRepository.save(any(Alert.class))).thenAnswer(invocation -> {
            Alert a = invocation.getArgument(0);
            a.setId("generated-id");
            return a;
        });

        alertService.handleAlert(dto);

        ArgumentCaptor<Alert> savedCaptor = ArgumentCaptor.forClass(Alert.class);
        verify(alertRepository).save(savedCaptor.capture());
        Alert saved = savedCaptor.getValue();

        assertEquals("CPU_HIGH", saved.getRuleType());
        assertEquals("cpu above threshold", saved.getMessage());
        assertEquals("auth", saved.getService());
        assertEquals("high", saved.getSeverity());
        verify(webSocketService).sendAlert(any(Alert.class));
    }

    @Test
    void getAlertById_existing_returnsAlert() {
        Alert a = new Alert();
        a.setId("1");
        a.setMessage("m");

        when(alertRepository.findById("1")).thenReturn(Optional.of(a));
        Alert result = alertService.getAlertById("1");

        assertNotNull(result);
        assertEquals("1", result.getId());
    }

    @Test
    void getAlertById_notFound_throws() {
        when(alertRepository.findById("missing")).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> alertService.getAlertById("missing"));
        assertTrue(ex.getMessage().contains("not found"));
    }

    @Test
    void updateAlertStatus_updatesAndSends() {
        Alert a = new Alert();
        a.setId("2");
        a.setStatus(Alert.AlertStatus.OPEN);

        when(alertRepository.findById("2")).thenReturn(Optional.of(a));
        when(alertRepository.save(any(Alert.class))).thenAnswer(inv -> inv.getArgument(0));

        Alert updated = alertService.updateAlertStatus("2", "RESOLVED");

        assertEquals(Alert.AlertStatus.RESOLVED, updated.getStatus());
        verify(webSocketService).sendAlert(updated);
    }

    @Test
    void updateNote_updatesAndSends() {
        Alert a = new Alert();
        a.setId("3");

        when(alertRepository.findById("3")).thenReturn(Optional.of(a));
        when(alertRepository.save(any(Alert.class))).thenAnswer(inv -> inv.getArgument(0));

        Alert updated = alertService.updateNote("3", "fixed");

        assertEquals("fixed", updated.getResolutionNotes());
        verify(webSocketService).sendAlert(updated);
    }

    @Test
    void getOpenAlerts_delegatesToRepo() {
        List<Alert> list = List.of(new Alert());
        when(alertRepository.findByStatus(Alert.AlertStatus.OPEN)).thenReturn(list);

        List<Alert> result = alertService.getOpenAlerts();
        assertEquals(1, result.size());
    }

    @Test
    void getAllAlerts_delegatesToRepo() {
        List<Alert> list = List.of(new Alert());
        // We use any() because Sort parameter is passed in; we only care about delegation
        when(alertRepository.findAll(any(org.springframework.data.domain.Sort.class))).thenReturn(list);

        List<Alert> result = alertService.getAllAlerts();
        assertEquals(1, result.size());
    }
}

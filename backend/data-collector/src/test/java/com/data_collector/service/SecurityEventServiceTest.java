package com.data_collector.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.data_collector.model.SecurityEvent;
import com.data_collector.repository.SecurityEventRepository;

class SecurityEventServiceTest {

    @Mock
    private SecurityEventRepository repo;

    @InjectMocks
    private SecurityEventService service;

    @BeforeEach
    void init() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void saveSecurityEvent_callsSave() {
        SecurityEvent in = new SecurityEvent();
        in.setEventId("e1");
        SecurityEvent saved = new SecurityEvent();
        saved.setId("db");
        when(repo.save(in)).thenReturn(saved);

        var out = service.saveSecurityEvent(in);
        assertThat(out).isSameAs(saved);
        verify(repo).save(in);
    }

    @Test
    void getCriticalEvents_usesCRITICALSeverity() {
        when(repo.findBySeverity("CRITICAL")).thenReturn(List.of());
        var res = service.getCriticalEvents();
        assertThat(res).isEmpty();
        verify(repo).findBySeverity("CRITICAL");
    }
}

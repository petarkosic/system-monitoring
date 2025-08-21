package com.data_collector.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.data_collector.model.LogEntry;
import com.data_collector.repository.LogRepository;

class LogServiceTest {

    @Mock
    private LogRepository logRepository;

    @InjectMocks
    private LogService logService;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void saveLog_delegatesToRepository_andReturnsSaved() {
        LogEntry in = new LogEntry();
        in.setLogId("log-1");
        in.setMessage("hello");
        LogEntry saved = new LogEntry();
        saved.setId("db-id");
        saved.setLogId(in.getLogId());

        when(logRepository.save(in)).thenReturn(saved);

        LogEntry result = logService.saveLog(in);
        assertThat(result).isSameAs(saved);
        verify(logRepository, times(1)).save(in);
    }

    @Test
    void getLogsByService_callsRepository() {
        String service = "auth";
        LogEntry e = new LogEntry();
        e.setService(service);
        when(logRepository.findByService(service)).thenReturn(List.of(e));

        var list = logService.getLogsByService(service);
        assertThat(list).hasSize(1).first().extracting(LogEntry::getService).isEqualTo(service);
        verify(logRepository).findByService(service);
    }

    @Test
    void getLogsByTimeRange_callsRepository() {
        Instant start = Instant.now().minusSeconds(60);
        Instant end = Instant.now();
        when(logRepository.findByTimestampBetween(start, end)).thenReturn(List.of());

        var res = logService.getLogsByTimeRange(start, end);
        assertThat(res).isEmpty();
        verify(logRepository).findByTimestampBetween(start, end);
    }
}

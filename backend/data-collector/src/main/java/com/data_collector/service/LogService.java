package com.data_collector.service;

import com.data_collector.model.LogEntry;
import com.data_collector.repository.LogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LogService {
    private final LogRepository logRepository;

    public LogEntry saveLog(LogEntry logEntry) {
        return logRepository.save(logEntry);
    }

    public List<LogEntry> getLogsByService(String service) {
        return logRepository.findByService(service);
    }

    public List<LogEntry> getLogsByLevel(String level) {
        return logRepository.findByLevel(level);
    }

    public List<LogEntry> getLogsByTimeRange(Instant start, Instant end) {
        return logRepository.findByTimestampBetween(start, end);
    }
}